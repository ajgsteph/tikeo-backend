from app import check_site_availability


def test_check_site_availability():
    # Test with a known available site
    assert check_site_availability("https://www.google.com") is True

    # Test with a known unavailable site
    assert check_site_availability("http://nonexistent.example.com") is False


