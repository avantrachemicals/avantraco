"""
Avantra Chemicals API Tests
Tests all backend API endpoints with static fallback data (no MySQL configured)
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://avantra-dynamic.preview.emergentagent.com')

class TestAPIHealth:
    """Basic API health checks"""
    
    def test_api_root(self):
        """Test API root returns expected response"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"✅ API root: {data}")

class TestAdminAuth:
    """Admin authentication tests"""
    
    def test_admin_login_success(self):
        """Test admin login with correct password"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": "admin123"})
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert len(data["token"]) > 0
        print("✅ Admin login successful")
        return data["token"]
    
    def test_admin_login_invalid_password(self):
        """Test admin login with wrong password returns 401"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": "wrongpassword"})
        assert response.status_code == 401
        print("✅ Invalid password correctly returns 401")

class TestPagesAPI:
    """Page content API tests"""
    
    def test_list_pages(self):
        """Test listing all pages returns 8 pages"""
        response = requests.get(f"{BASE_URL}/api/pages")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 8  # home, about, products, contact, dealers, careers, gallery, media
        page_keys = [p['page_key'] for p in data]
        assert 'home' in page_keys
        assert 'about' in page_keys
        assert 'products' in page_keys
        print(f"✅ Pages list: {len(data)} pages found")
    
    def test_get_home_page(self):
        """Test getting home page content with hero slides"""
        response = requests.get(f"{BASE_URL}/api/pages/home")
        assert response.status_code == 200
        data = response.json()
        assert data['page_key'] == 'home'
        assert 'content' in data
        assert 'seo' in data
        
        # Verify hero_slides exist and have translatable content
        content = data['content']
        assert 'hero_slides' in content
        assert len(content['hero_slides']) >= 1
        
        # Verify translatable structure (en, hi, te, kn)
        slide = content['hero_slides'][0]
        assert 'en' in slide['title_top']
        print("✅ Home page content with hero slides verified")

class TestLabelsAPI:
    """UI Labels API tests"""
    
    def test_list_labels(self):
        """Test listing UI labels returns object with translatable text"""
        response = requests.get(f"{BASE_URL}/api/labels")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, dict)
        assert 'nav.home' in data
        
        # Verify translatable structure
        nav_home = data['nav.home']
        assert 'en' in nav_home
        assert nav_home['en'] == 'Home'
        print(f"✅ Labels: {len(data)} labels found")
    
    def test_list_all_labels(self):
        """Test listing all labels with metadata"""
        response = requests.get(f"{BASE_URL}/api/labels/all")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        
        # Verify label structure
        label = data[0]
        assert 'label_key' in label
        assert 'text' in label
        assert 'category' in label
        print(f"✅ All labels: {len(data)} labels with metadata")

class TestCategoriesAPI:
    """Product Categories API tests"""
    
    def test_list_categories(self):
        """Test listing categories returns 5 categories with translations"""
        response = requests.get(f"{BASE_URL}/api/categories")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 5
        
        # Verify categories
        category_keys = [c['category_key'] for c in data]
        assert 'biostimulant' in category_keys
        assert 'biofertilizer' in category_keys
        assert 'liquid_fertilizer' in category_keys
        assert 'micronutrient' in category_keys
        assert 'water_soluble' in category_keys
        
        # Verify translatable structure
        cat = data[0]
        assert 'name' in cat
        assert 'en' in cat['name']
        print(f"✅ Categories: {len(data)} categories found")

class TestSettingsAPI:
    """Site settings API tests"""
    
    def test_get_settings(self):
        """Test getting site settings with translatable fields"""
        response = requests.get(f"{BASE_URL}/api/settings")
        assert response.status_code == 200
        data = response.json()
        
        # Verify basic settings
        assert 'site_name' in data
        assert 'tagline' in data
        assert 'address' in data
        assert 'phone' in data
        assert 'email' in data
        
        # Verify translatable fields
        assert 'en' in data['site_name']
        assert data['site_name']['en'] == 'Avantra Chemicals'
        
        print("✅ Settings: Site settings with translations verified")

class TestProductsAPI:
    """Products API tests"""
    
    def test_list_products_empty(self):
        """Test listing products returns empty (no DB)"""
        response = requests.get(f"{BASE_URL}/api/products")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # Products are empty since no MySQL configured
        print(f"✅ Products list: {len(data)} products (expected empty without DB)")
    
    def test_filter_products_by_category(self):
        """Test filtering products by category"""
        response = requests.get(f"{BASE_URL}/api/products", params={"category": "biostimulant"})
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print("✅ Products filter by category works")

class TestContactAPI:
    """Contact form API tests"""
    
    def test_contact_list(self):
        """Test listing contacts returns empty (no DB)"""
        response = requests.get(f"{BASE_URL}/api/contact")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Contacts list: {len(data)} contacts")

class TestDealersAPI:
    """Dealers API tests"""
    
    def test_dealers_list(self):
        """Test listing dealers returns empty (no DB)"""
        response = requests.get(f"{BASE_URL}/api/dealers")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Dealers list: {len(data)} dealers")

class TestGalleryAPI:
    """Gallery API tests"""
    
    def test_gallery_list(self):
        """Test listing gallery returns empty (no DB)"""
        response = requests.get(f"{BASE_URL}/api/gallery")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Gallery list: {len(data)} images")

class TestBlogAPI:
    """Blog API tests"""
    
    def test_blog_list(self):
        """Test listing blog posts returns empty (no DB)"""
        response = requests.get(f"{BASE_URL}/api/blog")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Blog list: {len(data)} posts")

class TestJobsAPI:
    """Jobs API tests"""
    
    def test_jobs_list(self):
        """Test listing jobs returns empty (no DB)"""
        response = requests.get(f"{BASE_URL}/api/jobs")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Jobs list: {len(data)} jobs")

class TestVideosAPI:
    """Videos API tests"""
    
    def test_videos_list(self):
        """Test listing videos returns empty (no DB)"""
        response = requests.get(f"{BASE_URL}/api/videos")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Videos list: {len(data)} videos")

class TestStatsAPI:
    """Stats API tests"""
    
    def test_get_stats(self):
        """Test getting stats"""
        response = requests.get(f"{BASE_URL}/api/stats")
        assert response.status_code == 200
        data = response.json()
        assert 'products' in data
        assert 'dealers' in data
        assert 'farmers' in data
        assert 'states' in data
        print(f"✅ Stats: {data}")

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
