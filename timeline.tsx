
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { MessageSquare, ThumbsUp, Send, Image, MapPin, Gift } from "lucide-react";

export default function Timeline() {
  const [newPost, setNewPost] = useState("");
  
  const { data: userData } = useQuery({
    queryKey: ["/api/users/me"],
  });

  // Data timeline dummy
  const timelinePosts = [
    {
      id: 1,
      author: {
        name: "Admin",
        avatar: "/avatar.png",
        role: "Admin"
      },
      content: "Selamat Ulang Tahun! 🎉 \nDirgahayu ke-5 perusahaan kita! Terima kasih atas kerja keras dan dedikasi yang luar biasa dari seluruh karyawan yang telah berkontribusi pada pertumbuhan dan kesuksesan perusahaan kita. Mari terus berinovasi dan maju bersama! 🚀",
      time: "2024-07-10T09:00:00Z",
      image: "/company-anniversary.jpg",
      likes: 24,
      comments: 8,
      isAnnouncement: true
    },
    {
      id: 2,
      author: {
        name: "Budi Santoso",
        avatar: "/avatar1.png",
        role: "Marketing Officer"
      },
      content: "Hari ini saya menghadiri seminar pemasaran digital. Banyak insight baru yang bisa diimplementasikan untuk strategi marketing kita ke depan!",
      time: "2024-07-09T14:30:00Z",
      image: "/seminar.jpg",
      likes: 15,
      comments: 3,
      isAnnouncement: false
    },
    {
      id: 3,
      author: {
        name: "Siti Rahayu",
        avatar: "/avatar2.png",
        role: "Finance Manager"
      },
      content: "Tim Finance berhasil menyelesaikan laporan keuangan Q2 tepat waktu. Great job team! 👏",
      time: "2024-07-08T16:45:00Z",
      likes: 18,
      comments: 5,
      isAnnouncement: false
    }
  ];

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Fitur posting masih dalam pengembangan");
    setNewPost("");
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">Timeline</h1>
      
      <Card>
        <CardContent className="pt-4">
          <form onSubmit={handlePostSubmit}>
            <div className="flex gap-3">
              <Avatar>
                <AvatarImage src={userData?.user?.avatar || undefined} />
                <AvatarFallback>
                  {userData?.user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Share something awesome today..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="resize-none"
                />
                <div className="flex justify-between mt-3">
                  <div className="flex gap-2">
                    <Button type="button" size="sm" variant="outline">
                      <Image className="h-4 w-4 mr-2" />
                      Foto
                    </Button>
                    <Button type="button" size="sm" variant="outline">
                      <MapPin className="h-4 w-4 mr-2" />
                      Lokasi
                    </Button>
                  </div>
                  <Button type="submit" size="sm" disabled={!newPost.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {timelinePosts.map((post) => (
        <Card key={post.id} className={post.isAnnouncement ? "border-primary" : ""}>
          {post.isAnnouncement && (
            <div className="bg-primary px-4 py-1 text-primary-foreground text-sm font-semibold">
              Pengumuman
            </div>
          )}
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <Avatar>
                  <AvatarImage src={post.author.avatar} />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{post.author.name}</div>
                  <div className="text-sm text-muted-foreground">{post.author.role}</div>
                </div>
              </div>
              <time className="text-sm text-muted-foreground">
                {format(new Date(post.time), "d MMM yyyy, HH:mm")}
              </time>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="whitespace-pre-line">{post.content}</div>
            
            {post.image && (
              <div className="mt-3 rounded-md overflow-hidden">
                <img
                  src={post.image}
                  alt="Post image"
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://via.placeholder.com/800x400?text=Post+Image`;
                  }}
                />
              </div>
            )}
            
            <div className="flex gap-6 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                <span>{post.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{post.comments} comments</span>
              </div>
            </div>
          </CardContent>
          <div className="border-t px-4 py-2 flex gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={userData?.user?.avatar || undefined} />
              <AvatarFallback>
                {userData?.user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 flex gap-2">
              <Input placeholder="Write a comment..." className="h-8" />
              <Button size="icon" className="h-8 w-8">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
