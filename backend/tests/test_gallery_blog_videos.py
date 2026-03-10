"""
Backend API Tests for Gallery, Blog/Media Center, and Video Testimonials
Tests: CRUD operations for gallery images, blog posts, and video testimonials
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
ADMIN_PASSWORD = "avantra2024"


@pytest.fixture(scope="module")
def api_client():
    """Shared requests session"""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


@pytest.fixture(scope="module")
def admin_token(api_client):
    """Get admin authentication token"""
    response = api_client.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
    assert response.status_code == 200, f"Admin login failed: {response.text}"
    return response.json().get("token")


@pytest.fixture(scope="module")
def auth_headers(admin_token):
    """Headers with admin auth token"""
    return {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}


# ============ GALLERY TESTS ============

class TestGalleryAPI:
    """Gallery CRUD endpoint tests"""
    
    def test_list_gallery_empty_or_populated(self, api_client):
        """GET /api/gallery - List gallery images (public)"""
        response = api_client.get(f"{BASE_URL}/api/gallery")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Gallery has {len(data)} images")
    
    def test_list_gallery_with_category_filter(self, api_client):
        """GET /api/gallery?category=factory - Filter by category"""
        for category in ["general", "factory", "team", "events", "products"]:
            response = api_client.get(f"{BASE_URL}/api/gallery?category={category}")
            assert response.status_code == 200
            data = response.json()
            assert isinstance(data, list)
            # All returned items should have matching category
            for item in data:
                assert item.get("category") == category
        print("Category filter works for all gallery categories")
    
    def test_create_gallery_image(self, api_client, auth_headers):
        """POST /api/gallery - Create gallery image (admin)"""
        test_image = {
            "title": f"TEST_Gallery_Image_{uuid.uuid4().hex[:8]}",
            "description": "Test image description for automated testing",
            "image_url": "https://images.unsplash.com/photo-1560493676-04071c5f467b",
            "category": "factory",
            "is_featured": True
        }
        response = api_client.post(f"{BASE_URL}/api/gallery", json=test_image, headers=auth_headers)
        assert response.status_code == 200, f"Create gallery failed: {response.text}"
        data = response.json()
        assert "id" in data
        assert data["title"] == test_image["title"]
        assert data["category"] == "factory"
        assert data["is_featured"] == True
        print(f"Created gallery image: {data['id']}")
        return data
    
    def test_update_gallery_image(self, api_client, auth_headers):
        """PUT /api/gallery/{image_id} - Update gallery image (admin)"""
        # First create an image
        create_data = {
            "title": f"TEST_Update_{uuid.uuid4().hex[:8]}",
            "image_url": "https://images.unsplash.com/photo-1560493676-04071c5f467b",
            "category": "team"
        }
        create_response = api_client.post(f"{BASE_URL}/api/gallery", json=create_data, headers=auth_headers)
        assert create_response.status_code == 200
        image_id = create_response.json()["id"]
        
        # Update the image
        update_data = {
            "title": "TEST_Updated_Title",
            "description": "Updated description",
            "image_url": "https://images.unsplash.com/photo-1560493676-04071c5f467b",
            "category": "events",
            "is_featured": True
        }
        update_response = api_client.put(f"{BASE_URL}/api/gallery/{image_id}", json=update_data, headers=auth_headers)
        assert update_response.status_code == 200
        updated = update_response.json()
        assert updated["title"] == "TEST_Updated_Title"
        assert updated["category"] == "events"
        print(f"Updated gallery image: {image_id}")
        
        # Verify with GET
        get_response = api_client.get(f"{BASE_URL}/api/gallery")
        images = get_response.json()
        found = next((img for img in images if img["id"] == image_id), None)
        assert found is not None
        assert found["category"] == "events"
    
    def test_delete_gallery_image(self, api_client, auth_headers):
        """DELETE /api/gallery/{image_id} - Delete gallery image (admin)"""
        # Create then delete
        create_data = {
            "title": f"TEST_Delete_{uuid.uuid4().hex[:8]}",
            "image_url": "https://images.unsplash.com/photo-1560493676-04071c5f467b",
            "category": "general"
        }
        create_response = api_client.post(f"{BASE_URL}/api/gallery", json=create_data, headers=auth_headers)
        image_id = create_response.json()["id"]
        
        delete_response = api_client.delete(f"{BASE_URL}/api/gallery/{image_id}", headers=auth_headers)
        assert delete_response.status_code == 200
        assert delete_response.json()["message"] == "Image deleted"
        print(f"Deleted gallery image: {image_id}")
    
    def test_gallery_unauthorized_create(self, api_client):
        """POST /api/gallery without auth should fail"""
        response = api_client.post(f"{BASE_URL}/api/gallery", json={"title": "test", "image_url": "http://test.com"})
        assert response.status_code == 401
        print("Unauthorized gallery create correctly rejected")


# ============ BLOG TESTS ============

class TestBlogAPI:
    """Blog/Media Center CRUD endpoint tests"""
    
    def test_list_blog_posts(self, api_client):
        """GET /api/blog - List published blog posts (public)"""
        response = api_client.get(f"{BASE_URL}/api/blog")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Blog has {len(data)} posts")
    
    def test_create_blog_post(self, api_client, auth_headers):
        """POST /api/blog - Create blog post (admin)"""
        test_post = {
            "title": f"TEST_Blog_Post_{uuid.uuid4().hex[:8]}",
            "slug": "",
            "featured_image": "https://images.unsplash.com/photo-1574943320219-553eb213f72d",
            "excerpt": "This is a test blog post excerpt for automated testing",
            "content": "This is the full content of the test blog post. It supports multiple paragraphs and formatting.",
            "links": [
                {"title": "Learn More", "url": "https://example.com/learn"},
                {"title": "Documentation", "url": "https://example.com/docs"}
            ],
            "tags": ["agriculture", "technology", "testing"],
            "is_published": True
        }
        response = api_client.post(f"{BASE_URL}/api/blog", json=test_post, headers=auth_headers)
        assert response.status_code == 200, f"Create blog failed: {response.text}"
        data = response.json()
        assert "id" in data
        assert "slug" in data and data["slug"]  # Slug should be auto-generated
        assert data["title"] == test_post["title"]
        assert data["is_published"] == True
        assert len(data["links"]) == 2
        assert len(data["tags"]) == 3
        print(f"Created blog post: {data['id']} with slug: {data['slug']}")
        return data
    
    def test_get_blog_post_by_slug(self, api_client, auth_headers):
        """GET /api/blog/{slug} - Get blog post by slug"""
        # Create a post first
        create_data = {
            "title": f"TEST_Slug_Post_{uuid.uuid4().hex[:8]}",
            "content": "Test content",
            "is_published": True
        }
        create_response = api_client.post(f"{BASE_URL}/api/blog", json=create_data, headers=auth_headers)
        slug = create_response.json()["slug"]
        
        # Get by slug
        response = api_client.get(f"{BASE_URL}/api/blog/{slug}")
        assert response.status_code == 200
        data = response.json()
        assert data["slug"] == slug
        print(f"Retrieved blog post by slug: {slug}")
    
    def test_update_blog_post(self, api_client, auth_headers):
        """PUT /api/blog/{post_id} - Update blog post (admin)"""
        # Create a post
        create_data = {
            "title": f"TEST_Update_Post_{uuid.uuid4().hex[:8]}",
            "content": "Original content",
            "is_published": False
        }
        create_response = api_client.post(f"{BASE_URL}/api/blog", json=create_data, headers=auth_headers)
        post_id = create_response.json()["id"]
        
        # Update the post
        update_data = {
            "title": "TEST_Updated_Title",
            "content": "Updated content with more details",
            "excerpt": "New excerpt",
            "links": [{"title": "New Link", "url": "https://newlink.com"}],
            "tags": ["updated", "test"],
            "is_published": True
        }
        update_response = api_client.put(f"{BASE_URL}/api/blog/{post_id}", json=update_data, headers=auth_headers)
        assert update_response.status_code == 200
        updated = update_response.json()
        assert updated["title"] == "TEST_Updated_Title"
        assert updated["is_published"] == True
        print(f"Updated blog post: {post_id}")
    
    def test_delete_blog_post(self, api_client, auth_headers):
        """DELETE /api/blog/{post_id} - Delete blog post (admin)"""
        # Create then delete
        create_data = {
            "title": f"TEST_Delete_Post_{uuid.uuid4().hex[:8]}",
            "content": "To be deleted"
        }
        create_response = api_client.post(f"{BASE_URL}/api/blog", json=create_data, headers=auth_headers)
        post_id = create_response.json()["id"]
        
        delete_response = api_client.delete(f"{BASE_URL}/api/blog/{post_id}", headers=auth_headers)
        assert delete_response.status_code == 200
        assert delete_response.json()["message"] == "Post deleted"
        print(f"Deleted blog post: {post_id}")
    
    def test_blog_post_not_found(self, api_client):
        """GET /api/blog/{slug} - Should return 404 for non-existent slug"""
        response = api_client.get(f"{BASE_URL}/api/blog/non-existent-slug-xyz123")
        assert response.status_code == 404
        print("Blog post 404 works correctly")


# ============ VIDEO TESTIMONIALS TESTS ============

class TestVideoTestimonialsAPI:
    """Video Testimonials CRUD endpoint tests"""
    
    def test_list_video_testimonials(self, api_client):
        """GET /api/testimonials/videos - List all video testimonials (public)"""
        response = api_client.get(f"{BASE_URL}/api/testimonials/videos")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Found {len(data)} video testimonials")
    
    def test_list_featured_videos_only(self, api_client):
        """GET /api/testimonials/videos?featured_only=true - List featured videos"""
        response = api_client.get(f"{BASE_URL}/api/testimonials/videos?featured_only=true")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # All returned should be featured
        for video in data:
            assert video.get("is_featured") == True
        print(f"Featured videos filter works: {len(data)} featured")
    
    def test_create_video_testimonial_youtube(self, api_client, auth_headers):
        """POST /api/testimonials/videos - Create YouTube video testimonial (admin)"""
        test_video = {
            "title": f"TEST_Video_{uuid.uuid4().hex[:8]}",
            "farmer_name": "Test Farmer",
            "location": "Karnataka",
            "crop": "Mango",
            "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "thumbnail_url": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
            "quote": "This product helped increase my yield by 30%!",
            "is_featured": True
        }
        response = api_client.post(f"{BASE_URL}/api/testimonials/videos", json=test_video, headers=auth_headers)
        assert response.status_code == 200, f"Create video failed: {response.text}"
        data = response.json()
        assert "id" in data
        assert data["farmer_name"] == "Test Farmer"
        assert data["is_featured"] == True
        assert "youtube" in data["video_url"]
        print(f"Created video testimonial: {data['id']}")
        return data
    
    def test_create_video_testimonial_vimeo(self, api_client, auth_headers):
        """POST /api/testimonials/videos - Create Vimeo video testimonial (admin)"""
        test_video = {
            "title": f"TEST_Vimeo_{uuid.uuid4().hex[:8]}",
            "farmer_name": "Vimeo Test Farmer",
            "location": "Andhra Pradesh",
            "crop": "Rice",
            "video_url": "https://vimeo.com/123456789",
            "is_featured": False
        }
        response = api_client.post(f"{BASE_URL}/api/testimonials/videos", json=test_video, headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "vimeo" in data["video_url"]
        print(f"Created Vimeo video: {data['id']}")
    
    def test_update_video_testimonial(self, api_client, auth_headers):
        """PUT /api/testimonials/videos/{video_id} - Update video (admin)"""
        # Create a video
        create_data = {
            "title": f"TEST_Update_Video_{uuid.uuid4().hex[:8]}",
            "farmer_name": "Original Name",
            "video_url": "https://youtube.com/watch?v=test123",
            "is_featured": False
        }
        create_response = api_client.post(f"{BASE_URL}/api/testimonials/videos", json=create_data, headers=auth_headers)
        video_id = create_response.json()["id"]
        
        # Update the video
        update_data = {
            "title": "TEST_Updated_Video",
            "farmer_name": "Updated Farmer Name",
            "location": "New Location",
            "crop": "Cotton",
            "video_url": "https://youtube.com/watch?v=updated123",
            "quote": "New testimonial quote",
            "is_featured": True
        }
        update_response = api_client.put(f"{BASE_URL}/api/testimonials/videos/{video_id}", json=update_data, headers=auth_headers)
        assert update_response.status_code == 200
        updated = update_response.json()
        assert updated["farmer_name"] == "Updated Farmer Name"
        assert updated["is_featured"] == True
        print(f"Updated video: {video_id}")
    
    def test_delete_video_testimonial(self, api_client, auth_headers):
        """DELETE /api/testimonials/videos/{video_id} - Delete video (admin)"""
        # Create then delete
        create_data = {
            "title": f"TEST_Delete_Video_{uuid.uuid4().hex[:8]}",
            "farmer_name": "To Delete",
            "video_url": "https://youtube.com/watch?v=delete123"
        }
        create_response = api_client.post(f"{BASE_URL}/api/testimonials/videos", json=create_data, headers=auth_headers)
        video_id = create_response.json()["id"]
        
        delete_response = api_client.delete(f"{BASE_URL}/api/testimonials/videos/{video_id}", headers=auth_headers)
        assert delete_response.status_code == 200
        assert delete_response.json()["message"] == "Video deleted"
        print(f"Deleted video: {video_id}")
    
    def test_video_unauthorized_create(self, api_client):
        """POST /api/testimonials/videos without auth should fail"""
        response = api_client.post(f"{BASE_URL}/api/testimonials/videos", json={
            "title": "test",
            "farmer_name": "test",
            "video_url": "http://test.com"
        })
        assert response.status_code == 401
        print("Unauthorized video create correctly rejected")


# ============ ENHANCED PRODUCT FIELDS TESTS ============

class TestEnhancedProductFields:
    """Test enhanced product fields: composition, how_it_works, growth_stages, advantages"""
    
    def test_create_product_with_enhanced_fields(self, api_client, auth_headers):
        """POST /api/products - Create product with all enhanced fields"""
        test_product = {
            "name": f"TEST_Enhanced_Product_{uuid.uuid4().hex[:8]}",
            "category": "biostimulant",
            "image_url": "https://example.com/product.jpg",
            "tagline": {"en": "Test tagline", "te": "", "kn": "", "hi": ""},
            "overview": {"en": "Product overview text", "te": "", "kn": "", "hi": ""},
            "dosage": {"en": "2-3 ml per liter", "te": "", "kn": "", "hi": ""},
            "composition": [
                {"component": "Seaweed Extract", "specification": "8%"},
                {"component": "Humic Acid", "specification": "10%"},
                {"component": "Potassium", "specification": "2%"}
            ],
            "how_it_works": {
                "en": [
                    "Enhances root development",
                    "Improves nutrient uptake",
                    "Boosts stress resistance"
                ],
                "te": [], "kn": [], "hi": []
            },
            "growth_stages": {
                "en": [
                    "Vegetative Stage",
                    "Flowering Stage",
                    "Fruiting Stage"
                ],
                "te": [], "kn": [], "hi": []
            },
            "advantages": {
                "en": [
                    "Increases yield by 20-30%",
                    "Improves fruit quality",
                    "Eco-friendly formulation"
                ],
                "te": [], "kn": [], "hi": []
            },
            "featured": True
        }
        response = api_client.post(f"{BASE_URL}/api/products", json=test_product, headers=auth_headers)
        assert response.status_code == 200, f"Create product failed: {response.text}"
        data = response.json()
        
        # Verify all enhanced fields
        assert len(data["composition"]) == 3
        assert data["composition"][0]["component"] == "Seaweed Extract"
        assert len(data["how_it_works"]["en"]) == 3
        assert len(data["growth_stages"]["en"]) == 3
        assert len(data["advantages"]["en"]) == 3
        print(f"Created product with enhanced fields: {data['id']}")
        
        # Verify via GET
        get_response = api_client.get(f"{BASE_URL}/api/products/{data['slug']}")
        assert get_response.status_code == 200
        fetched = get_response.json()
        assert fetched["composition"] == test_product["composition"]
        return data
    
    def test_update_product_enhanced_fields(self, api_client, auth_headers):
        """PUT /api/products/{id} - Update product enhanced fields"""
        # Create a product first
        create_data = {
            "name": f"TEST_Update_Enhanced_{uuid.uuid4().hex[:8]}",
            "category": "biofertilizer",
            "composition": [{"component": "Original", "specification": "5%"}],
            "how_it_works": {"en": ["Original point"], "te": [], "kn": [], "hi": []},
            "growth_stages": {"en": [], "te": [], "kn": [], "hi": []},
            "advantages": {"en": [], "te": [], "kn": [], "hi": []}
        }
        create_response = api_client.post(f"{BASE_URL}/api/products", json=create_data, headers=auth_headers)
        product_id = create_response.json()["id"]
        
        # Update with new enhanced fields
        update_data = {
            "name": create_data["name"],
            "category": "biofertilizer",
            "composition": [
                {"component": "Updated Component", "specification": "15%"},
                {"component": "New Component", "specification": "25%"}
            ],
            "how_it_works": {
                "en": ["New mechanism 1", "New mechanism 2"],
                "te": [], "kn": [], "hi": []
            },
            "growth_stages": {
                "en": ["Seedling", "Mature"],
                "te": [], "kn": [], "hi": []
            },
            "advantages": {
                "en": ["Advantage 1", "Advantage 2", "Advantage 3"],
                "te": [], "kn": [], "hi": []
            }
        }
        update_response = api_client.put(f"{BASE_URL}/api/products/{product_id}", json=update_data, headers=auth_headers)
        assert update_response.status_code == 200
        updated = update_response.json()
        
        assert len(updated["composition"]) == 2
        assert updated["composition"][0]["specification"] == "15%"
        assert len(updated["how_it_works"]["en"]) == 2
        assert len(updated["advantages"]["en"]) == 3
        print(f"Updated product enhanced fields: {product_id}")


# ============ CLEANUP ============

@pytest.fixture(scope="module", autouse=True)
def cleanup_test_data(api_client, auth_headers):
    """Cleanup TEST_ prefixed data after all tests complete"""
    yield
    # Cleanup gallery
    gallery = api_client.get(f"{BASE_URL}/api/gallery").json()
    for img in gallery:
        if img.get("title", "").startswith("TEST_"):
            api_client.delete(f"{BASE_URL}/api/gallery/{img['id']}", headers=auth_headers)
    
    # Cleanup blog
    blog = api_client.get(f"{BASE_URL}/api/blog?published_only=false", headers=auth_headers).json()
    for post in blog:
        if post.get("title", "").startswith("TEST_"):
            api_client.delete(f"{BASE_URL}/api/blog/{post['id']}", headers=auth_headers)
    
    # Cleanup videos
    videos = api_client.get(f"{BASE_URL}/api/testimonials/videos").json()
    for video in videos:
        if video.get("title", "").startswith("TEST_"):
            api_client.delete(f"{BASE_URL}/api/testimonials/videos/{video['id']}", headers=auth_headers)
    
    # Cleanup products
    products = api_client.get(f"{BASE_URL}/api/products").json()
    for product in products:
        if product.get("name", "").startswith("TEST_"):
            api_client.delete(f"{BASE_URL}/api/products/{product['id']}", headers=auth_headers)
    
    print("\nCleanup: Removed TEST_ prefixed items")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
