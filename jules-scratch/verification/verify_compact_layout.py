from playwright.sync_api import sync_playwright, Page, expect

def test_compact_layout(page: Page):
    """
    This test verifies that the UI is more compact vertically.
    """
    print("Navigating to homepage...")
    page.goto("http://localhost:5173/")
    page.wait_for_load_state("load")
    print("Homepage loaded.")

    print("Taking homepage screenshot...")
    page.screenshot(path="jules-scratch/verification/homepage.png")
    print("Homepage screenshot taken.")

    # Check if there are any groups already
    groups = page.query_selector_all(".box")
    if not groups:
        print("No groups found, creating one...")
        page.get_by_placeholder("New group name").fill("Test Group")
        page.get_by_role("button", name="Create Group").click()
        page.wait_for_selector('a:has-text("Test Group")')

    print("Navigating to group page...")
    page.query_selector(".box a").click()
    page.wait_for_load_state("load")
    print("Group page loaded.")

    print("Taking group page screenshot...")
    page.screenshot(path="jules-scratch/verification/group-page.png")
    print("Group page screenshot taken.")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            test_compact_layout(page)
        finally:
            browser.close()

if __name__ == "__main__":
    main()
