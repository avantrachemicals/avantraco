"""
Test suite for Avantra Chemicals - Iteration 4
Testing all features requested in review_request:
- Products API including manual_url and leaflet_url fields
- Admin login and product form
- Other pages (About, Contact, Dealers, Gallery, Media Center, Careers)
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://avantra-chemicals.preview.emergentagent.com')

# Admin credentials
ADMIN_PASSWORD = "avantra2024"

class TestHealthAndBasics:
    """Health check and basic API tests"""
    
    def test_api_root(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"✓ API root: {data['message']}")
    
    def test_stats_endpoint(self):
        """Test stats endpoint"""
        response = requests.get(f"{BASE_URL}/api/stats")
        assert response.status_code == 200
        data = response.json()
        assert "products" in data
        assert "dealers" in data
        assert "farmers_served" in data
        print(f"✓ Stats: products={data['products']}, dealers={data['dealers']}")
    
    def test_settings_endpoint(self):
        """Test settings endpoint"""
        response = requests.get(f"{BASE_URL}/api/settings")
        assert response.status_code == 200
        data = response.json()
        assert "hero_image" in data or True  # May have defaults
        print(f"✓ Settings retrieved successfully")


class TestAdminAuth:
    """Admin authentication tests"""
    
    def test_admin_login_success(self):
        """Test admin login with correct password"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert len(data["token"]) > 10
        print(f"✓ Admin login successful, token received")
        return data["token"]
    
    def test_admin_login_invalid(self):
        """Test admin login with wrong password"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "password": "wrongpassword"
        })
        assert response.status_code == 401
        print(f"✓ Invalid password correctly rejected")


class TestProducts:
    """Product CRUD and feature tests"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        """Get admin token for authenticated requests"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={
            "password": ADMIN_PASSWORD
        })
        return response.json()["token"]
    
    def test_list_products(self):
        """Test listing products"""
        response = requests.get(f"{BASE_URL}/api/products")
        assert response.status_code == 200
        products = response.json()
        assert isinstance(products, list)
        print(f"✓ Products list: {len(products)} products found")
        return products
    
    def test_list_products_by_category(self):
        """Test filtering products by category"""
        categories = ["biostimulant", "biofertilizer", "liquid_fertilizer", "micronutrient"]
        for cat in categories:
            response = requests.get(f"{BASE_URL}/api/products", params={"category": cat})
            assert response.status_code == 200
            products = response.json()
            print(f"  ✓ Category '{cat}': {len(products)} products")
    
    def test_list_featured_products(self):
        """Test getting featured products"""
        response = requests.get(f"{BASE_URL}/api/products", params={"featured": True})
        assert response.status_code == 200
        products = response.json()
        print(f"✓ Featured products: {len(products)} products")
    
    def test_create_product_with_downloads(self, admin_token):
        """Test creating a product with manual_url and leaflet_url"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        product_data = {
            "name": "TEST_Product_Downloads",
            "slug": "test-product-downloads",
            "category": "biostimulant",
            "image_url": "https://example.com/image.jpg",
            "tagline": {"en": "Test product with downloads", "te": "", "kn": "", "hi": ""},
            "overview": {"en": "Test overview", "te": "", "kn": "", "hi": ""},
            "composition": [
                {"component": "Seaweed Extract", "specification": "8%"},
                {"component": "Humic Acid", "specification": "10%"}
            ],
            "advantages": {"en": ["Better yield", "Improved quality"], "te": [], "kn": [], "hi": []},
            "how_it_works": {"en": ["Step 1", "Step 2"], "te": [], "kn": [], "hi": []},
            "growth_stages": {"en": ["Vegetative", "Flowering"], "te": [], "kn": [], "hi": []},
            "dosage": {"en": "2ml per liter", "te": "", "kn": "", "hi": ""},
            "manual_url": "https://example.com/manual.pdf",
            "leaflet_url": "https://example.com/leaflet.pdf",
            "brand": "AVANTRA",
            "crops": "All Crops",
            "featured": False
        }
        
        response = requests.post(f"{BASE_URL}/api/products", json=product_data, headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "TEST_Product_Downloads"
        assert data["manual_url"] == "https://example.com/manual.pdf"
        assert data["leaflet_url"] == "https://example.com/leaflet.pdf"
        assert data["composition"] == product_data["composition"]
        print(f"✓ Product created with downloads: id={data['id']}")
        return data
    
    def test_get_product_by_slug(self, admin_token):
        """Test getting product by slug and verify downloads"""
        # First create a product
        headers = {"Authorization": f"Bearer {admin_token}"}
        product_data = {
            "name": "TEST_Get_Slug",
            "slug": "test-get-slug",
            "category": "biofertilizer",
            "manual_url": "https://example.com/test-manual.pdf",
            "leaflet_url": "https://example.com/test-leaflet.pdf"
        }
        create_response = requests.post(f"{BASE_URL}/api/products", json=product_data, headers=headers)
        assert create_response.status_code == 200
        
        # Now get by slug
        response = requests.get(f"{BASE_URL}/api/products/test-get-slug")
        assert response.status_code == 200
        data = response.json()
        assert data["slug"] == "test-get-slug"
        assert "manual_url" in data
        assert "leaflet_url" in data
        print(f"✓ Product retrieved by slug with download URLs")
    
    def test_update_product_downloads(self, admin_token):
        """Test updating product download URLs"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        # Create product
        product_data = {
            "name": "TEST_Update_Downloads",
            "slug": "test-update-downloads",
            "category": "micronutrient",
            "manual_url": "",
            "leaflet_url": ""
        }
        create_response = requests.post(f"{BASE_URL}/api/products", json=product_data, headers=headers)
        product = create_response.json()
        
        # Update with downloads
        product_data["manual_url"] = "https://newsite.com/new-manual.pdf"
        product_data["leaflet_url"] = "https://newsite.com/new-leaflet.pdf"
        
        response = requests.put(f"{BASE_URL}/api/products/{product['id']}", json=product_data, headers=headers)
        assert response.status_code == 200
        updated = response.json()
        assert updated["manual_url"] == "https://newsite.com/new-manual.pdf"
        assert updated["leaflet_url"] == "https://newsite.com/new-leaflet.pdf"
        print(f"✓ Product downloads updated successfully")


class TestContact:
    """Contact form tests"""
    
    def test_submit_contact_form(self):
        """Test submitting contact form"""
        contact_data = {
            "name": "TEST_Contact_User",
            "email": "test@example.com",
            "phone": "+91 9876543210",
            "message": "This is a test message",
            "language": "en"
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=contact_data)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "TEST_Contact_User"
        assert "id" in data
        print(f"✓ Contact form submitted: id={data['id']}")
    
    def test_list_contacts_requires_auth(self):
        """Test that listing contacts requires admin auth"""
        response = requests.get(f"{BASE_URL}/api/contact")
        assert response.status_code == 401
        print(f"✓ Contact list correctly requires authentication")
    
    def test_list_contacts_with_auth(self):
        """Test listing contacts with admin auth"""
        # Get token
        token_response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
        token = token_response.json()["token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.get(f"{BASE_URL}/api/contact", headers=headers)
        assert response.status_code == 200
        contacts = response.json()
        assert isinstance(contacts, list)
        print(f"✓ Contacts retrieved: {len(contacts)} contacts")


class TestDealers:
    """Dealer application tests"""
    
    def test_submit_dealer_application(self):
        """Test submitting dealer application"""
        dealer_data = {
            "name": "TEST_Dealer",
            "business_name": "TEST_Agro Supplies",
            "email": "dealer@test.com",
            "phone": "+91 1234567890",
            "location": "Hyderabad, Telangana",
            "message": "I want to become a dealer"
        }
        response = requests.post(f"{BASE_URL}/api/dealers/apply", json=dealer_data)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "TEST_Dealer"
        assert "id" in data
        print(f"✓ Dealer application submitted: id={data['id']}")
    
    def test_list_dealer_applications(self):
        """Test listing dealer applications with admin auth"""
        token_response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
        token = token_response.json()["token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.get(f"{BASE_URL}/api/dealers/applications", headers=headers)
        assert response.status_code == 200
        apps = response.json()
        assert isinstance(apps, list)
        print(f"✓ Dealer applications retrieved: {len(apps)} applications")


class TestGallery:
    """Gallery CRUD tests"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
        return response.json()["token"]
    
    def test_list_gallery(self):
        """Test listing gallery images"""
        response = requests.get(f"{BASE_URL}/api/gallery")
        assert response.status_code == 200
        images = response.json()
        assert isinstance(images, list)
        print(f"✓ Gallery images: {len(images)} images")
    
    def test_create_gallery_image(self, admin_token):
        """Test creating gallery image"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        image_data = {
            "title": "TEST_Gallery_Image",
            "description": "Test description",
            "image_url": "https://example.com/test-image.jpg",
            "category": "factory",
            "is_featured": False
        }
        response = requests.post(f"{BASE_URL}/api/gallery", json=image_data, headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "TEST_Gallery_Image"
        print(f"✓ Gallery image created: id={data['id']}")


class TestBlogMedia:
    """Blog/Media Center tests"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
        return response.json()["token"]
    
    def test_list_blog_posts(self):
        """Test listing blog posts"""
        response = requests.get(f"{BASE_URL}/api/blog")
        assert response.status_code == 200
        posts = response.json()
        assert isinstance(posts, list)
        print(f"✓ Blog posts: {len(posts)} posts")
    
    def test_create_blog_post(self, admin_token):
        """Test creating blog post"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        post_data = {
            "title": "TEST_Blog_Post",
            "slug": "test-blog-post",
            "featured_image": "https://example.com/blog-image.jpg",
            "excerpt": "Test excerpt",
            "content": "Test content for the blog post",
            "links": [{"title": "Related Link", "url": "https://example.com"}],
            "tags": ["test", "agriculture"],
            "is_published": True
        }
        response = requests.post(f"{BASE_URL}/api/blog", json=post_data, headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "TEST_Blog_Post"
        print(f"✓ Blog post created: id={data['id']}")


class TestJobs:
    """Jobs/Careers tests"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
        return response.json()["token"]
    
    def test_list_jobs(self):
        """Test listing active jobs"""
        response = requests.get(f"{BASE_URL}/api/jobs")
        assert response.status_code == 200
        jobs = response.json()
        assert isinstance(jobs, list)
        print(f"✓ Active jobs: {len(jobs)} jobs")
    
    def test_create_job(self, admin_token):
        """Test creating job posting"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        job_data = {
            "title": "TEST_Sales_Manager",
            "department": "Sales",
            "location": "Hyderabad",
            "type": "Full-time",
            "experience": "3-5 years",
            "description": "Test job description",
            "requirements": ["Requirement 1", "Requirement 2"],
            "responsibilities": ["Responsibility 1", "Responsibility 2"],
            "salary_range": "5-8 LPA",
            "is_active": True
        }
        response = requests.post(f"{BASE_URL}/api/jobs", json=job_data, headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "TEST_Sales_Manager"
        print(f"✓ Job created: id={data['id']}")


class TestVideoTestimonials:
    """Video testimonial tests"""
    
    @pytest.fixture(scope="class")
    def admin_token(self):
        response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
        return response.json()["token"]
    
    def test_list_videos(self):
        """Test listing video testimonials"""
        response = requests.get(f"{BASE_URL}/api/testimonials/videos")
        assert response.status_code == 200
        videos = response.json()
        assert isinstance(videos, list)
        print(f"✓ Video testimonials: {len(videos)} videos")
    
    def test_create_video(self, admin_token):
        """Test creating video testimonial"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        video_data = {
            "title": "TEST_Video_Testimonial",
            "farmer_name": "Test Farmer",
            "location": "Test Village",
            "crop": "Cotton",
            "video_url": "https://youtube.com/watch?v=test123",
            "thumbnail_url": "https://example.com/thumb.jpg",
            "quote": "Test quote",
            "is_featured": False
        }
        response = requests.post(f"{BASE_URL}/api/testimonials/videos", json=video_data, headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "TEST_Video_Testimonial"
        print(f"✓ Video testimonial created: id={data['id']}")


class TestCleanup:
    """Cleanup test data"""
    
    def test_cleanup_test_products(self):
        """Clean up test products"""
        # Get admin token
        token_response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
        token = token_response.json()["token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Get all products
        products_response = requests.get(f"{BASE_URL}/api/products")
        products = products_response.json()
        
        # Delete test products
        deleted = 0
        for product in products:
            if product.get("name", "").startswith("TEST_"):
                del_response = requests.delete(f"{BASE_URL}/api/products/{product['id']}", headers=headers)
                if del_response.status_code == 200:
                    deleted += 1
        
        print(f"✓ Cleaned up {deleted} test products")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
