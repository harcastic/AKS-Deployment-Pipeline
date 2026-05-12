"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cloud, Upload, LogOut, Trash2, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function DashboardPage() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (!token || !userData) {
      router.push("/login");
      return;
    }
    
    setUser(JSON.parse(userData));
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get('api/images', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setImages(response.data.data);
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
      } else {
        toast.error("Failed to load images");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        withCredentials: true
      });
    } catch (e) {}
    
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setIsUploading(true);
    try {
      const response = await axios.post('/api/images/upload', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      toast.success("Image uploaded successfully");
      setIsUploadDialogOpen(false);
      setFile(null);
      fetchImages(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/images/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      toast.success("Image deleted");
      fetchImages();
    } catch (error) {
      toast.error("Failed to delete image");
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between mx-auto px-4">
          <div className="flex items-center gap-2">
            <Cloud className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl tracking-tight hidden sm:inline-block">CloudGallery</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline-block">
              Welcome, {user?.name}
            </span>
            
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Upload className="h-4 w-4" />
                  <span className="hidden sm:inline-block">Upload Image</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Image</DialogTitle>
                  <DialogDescription>
                    Select an image to upload to your secure gallery. Max size 5MB (JPEG, PNG, WebP).
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpload} className="space-y-4">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Input 
                      id="picture" 
                      type="file" 
                      accept="image/jpeg, image/png, image/webp"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </div>
                  <Button type="submit" disabled={!file || isUploading} className="w-full">
                    {isUploading ? "Uploading..." : "Upload"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline-block">Logout</span>
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Your Gallery</h1>
        </div>

        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border rounded-xl">
            <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-4">
              <ImageIcon className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No images yet</h2>
            <p className="text-muted-foreground mb-6">Upload your first image to get started</p>
            <Button onClick={() => setIsUploadDialogOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((img) => (
              <div 
                key={img._id} 
                className="group relative rounded-xl overflow-hidden border border-border bg-muted/20 aspect-square cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
                onClick={() => setSelectedImage(img)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={img.imageUrl} 
                  alt="Gallery image" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-white/90 bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">
                      {(img.fileSize / 1024 / 1024).toFixed(2)} MB
                    </span>
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="h-8 w-8 rounded-full shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(img._id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Fullscreen Image Viewer */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-fit h-fit p-1 bg-transparent border-none shadow-2xl flex flex-col justify-center items-center">
          <DialogTitle className="sr-only">View Image</DialogTitle>
          <DialogDescription className="sr-only">Full screen view of the selected image</DialogDescription>
          {selectedImage && (
            <div className="relative w-full h-full flex flex-col items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={selectedImage.imageUrl} 
                alt="Fullscreen view" 
                className="max-w-full max-h-[90vh] object-contain rounded-md shadow-2xl"
              />
              <div className="mt-4 flex gap-4">
                <Button variant="secondary" onClick={() => window.open(selectedImage.imageUrl, '_blank')}>
                  Open Original
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    handleDelete(selectedImage._id);
                    setSelectedImage(null);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
