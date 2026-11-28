from html.parser import HTMLParser
from pathlib import Path
import re
import unittest
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
HTML_PATH = ROOT / "index.html"
SCRIPTURE_LINKS = {
    "Read 2 Corinthians 5:17–18 on The Amazing Word": "/kjv/b/2-corinthians/c/5/v/17-18",
    "Read 1 Peter 4:10 on The Amazing Word": "/kjv/b/1-peter/c/4/v/10",
    "Read John 15:26 on The Amazing Word": "/kjv/b/john/c/15/v/26",
    "Read Exodus 31:3 on The Amazing Word": "/kjv/b/exodus/c/31/v/3",
    "Read Colossians 3:23–24 on The Amazing Word": "/kjv/b/colossians/c/3/v/23-24",
    "Read Isaiah 1:26 on The Amazing Word": "/kjv/b/isaiah/c/1/v/26",
    "Read Isaiah 51:3 on The Amazing Word": "/kjv/b/isaiah/c/51/v/3",
    "Read Isaiah 61:4 on The Amazing Word": "/kjv/b/isaiah/c/61/v/4",
    "Read Psalm 1:3 on The Amazing Word": "/kjv/b/psalms/c/1/v/3",
}


def normalize(parts):
    return " ".join("".join(parts).split())


class SiteMarkupParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = []
        self.links = []
        self.images = []
        self.resources = []
        self.paragraphs = []
        self.text = []
        self.heading_one_count = 0
        self.main_count = 0
        self.current_link = None
        self.current_paragraph = None

    def handle_starttag(self, tag, raw_attrs):
        attrs = dict(raw_attrs)
        if attrs.get("id"):
            self.ids.append(attrs["id"])
        if tag == "h1":
            self.heading_one_count += 1
        if tag == "main":
            self.main_count += 1
        if tag == "img":
            self.images.append(attrs)

        if tag in {"a", "link"} and attrs.get("href"):
            self.resources.append(attrs["href"])
        if tag in {"img", "script", "source"} and attrs.get("src"):
            self.resources.append(attrs["src"])

        if tag == "p":
            self.current_paragraph = {"parts": [], "links": []}
            self.paragraphs.append(self.current_paragraph)
        if tag == "a":
            self.current_link = {"attrs": attrs, "parts": []}
            self.links.append(self.current_link)
            if self.current_paragraph is not None:
                self.current_paragraph["links"].append(self.current_link)

    def handle_data(self, data):
        self.text.append(data)
        if self.current_link is not None:
            self.current_link["parts"].append(data)
        if self.current_paragraph is not None:
            self.current_paragraph["parts"].append(data)

    def handle_endtag(self, tag):
        if tag == "a":
            self.current_link = None
        elif tag == "p":
            self.current_paragraph = None


class SiteRegressionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.markup = HTML_PATH.read_text(encoding="utf-8")
        cls.parser = SiteMarkupParser()
        cls.parser.feed(cls.markup)
        cls.parser.close()

    def test_document_has_one_primary_heading_and_main_landmark(self):
        self.assertEqual(self.parser.heading_one_count, 1)
        self.assertEqual(self.parser.main_count, 1)

    def test_ids_are_unique_and_fragment_links_resolve(self):
        self.assertEqual(len(self.parser.ids), len(set(self.parser.ids)))
        page_ids = set(self.parser.ids)
        fragment_links = [
            link["attrs"].get("href", "")
            for link in self.parser.links
            if link["attrs"].get("href", "").startswith("#")
        ]
        self.assertIn("#main", fragment_links)
        for href in fragment_links:
            self.assertIn(unquote(href[1:]), page_ids, f"Unresolved fragment: {href}")

    def test_local_resources_exist(self):
        css_path = ROOT / "styles.css"
        css = css_path.read_text(encoding="utf-8")
        css_resources = re.findall(r"url\(\s*['\"]?([^'\")]+)", css)

        for resource in [*self.parser.resources, *css_resources]:
            parsed = urlsplit(resource)
            if parsed.scheme or resource.startswith("//") or not parsed.path:
                continue
            path = (ROOT / unquote(parsed.path).lstrip("/")).resolve()
            self.assertTrue(path.is_relative_to(ROOT), f"Resource escapes repository: {resource}")
            self.assertTrue(path.is_file(), f"Missing local resource: {resource}")

    def test_every_image_has_an_alt_attribute(self):
        for image in self.parser.images:
            self.assertIn("alt", image, f"Image is missing alt text: {image.get('src', '')}")

    def test_external_new_tab_links_are_safe(self):
        for link in self.parser.links:
            attrs = link["attrs"]
            if attrs.get("target") != "_blank":
                continue
            scheme = urlsplit(attrs.get("href", "")).scheme
            if scheme not in {"http", "https"}:
                continue
            rel = set(attrs.get("rel", "").lower().split())
            self.assertTrue({"noopener", "noreferrer"} <= rel, attrs.get("href"))

    def test_scripture_links_match_the_selected_passages(self):
        actual = {}
        for link in self.parser.links:
            label = normalize(link["parts"])
            if not label.startswith("Read ") or not label.endswith(" on The Amazing Word"):
                continue
            self.assertNotIn(label, actual, f"Duplicate Scripture link: {label}")
            parsed = urlsplit(link["attrs"].get("href", ""))
            self.assertEqual(parsed.scheme, "https")
            self.assertEqual(parsed.netloc, "theamazingword.org")
            self.assertEqual(link["attrs"].get("target"), "_blank")
            actual[label] = parsed.path
        self.assertEqual(actual, SCRIPTURE_LINKS)

    def test_founder_company_links_are_present_and_open_new_tabs(self):
        expected = {
            "Accompany Health": "https://accompanyhealth.com/",
            "Microsoft": "https://www.microsoft.com/",
            "Marqeta": "https://www.marqeta.com/",
            "EarnIn": "https://www.earnin.com/",
            "Yoon Basketball Training": "https://yoonbasketballtraining.com/",
        }
        for label, href in expected.items():
            matches = [
                link
                for link in self.parser.links
                if normalize(link["parts"]) == label
                and link["attrs"].get("href") == href
            ]
            self.assertEqual(len(matches), 1, f"Missing or duplicate link: {label}")
            self.assertEqual(matches[0]["attrs"].get("target"), "_blank")

    def test_amazing_word_creator_credit_is_its_own_paragraph(self):
        about_url = "https://theamazingword.org/about"
        matching = [
            paragraph
            for paragraph in self.parser.paragraphs
            if any(link["attrs"].get("href") == about_url for link in paragraph["links"])
        ]
        self.assertEqual(len(matching), 1)
        self.assertEqual(
            normalize(matching[0]["parts"]),
            "He is also the creator of The Amazing Word.",
        )
        self.assertEqual(len(matching[0]["links"]), 1)
        self.assertEqual(matching[0]["links"][0]["attrs"].get("target"), "_blank")

    def test_prelaunch_disclosures_remain_visible(self):
        text = normalize(self.parser.text)
        self.assertIn("Classes have not yet begun, and enrollment is not yet open.", text)
        self.assertIn("Scholarships are a future goal and are not yet available.", text)

    def test_korean_switch_and_disclosures(self):
        switch = [
            link for link in self.parser.links
            if "language-switch" in link["attrs"].get("class", "").split()
        ]
        self.assertEqual(len(switch), 1)
        self.assertEqual(switch[0]["attrs"].get("href"), "?lang=ko")
        self.assertEqual(switch[0]["attrs"].get("hreflang"), "ko")
        self.assertIn("assets/ko.js", self.parser.resources)

        korean = (ROOT / "assets" / "ko.js").read_text(encoding="utf-8")
        self.assertIn("수업은 아직 시작되지 않았으며 등록도 열리지 않았습니다.", korean)
        self.assertIn("장학금은 앞으로의 목표이며 아직 제공되지 않습니다.", korean)
        self.assertIn("한국어 수업이나 한국어 지원의 제공을 의미하지 않습니다.", korean)

    def test_korean_scripture_labels_cover_current_passages(self):
        korean = (ROOT / "assets" / "ko.js").read_text(encoding="utf-8")
        labelled_paths = set(re.findall(r"'(/kjv/b/[^']+)':", korean))
        self.assertEqual(labelled_paths, set(SCRIPTURE_LINKS.values()))


if __name__ == "__main__":
    unittest.main()
