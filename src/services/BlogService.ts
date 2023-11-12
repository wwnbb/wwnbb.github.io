import { db } from './FirebaseStorage';
import { get, ref, DataSnapshot } from "firebase/database";

// Define a type for the structure of your blog posts
export type BlogPost = {
    id: string; // or number, depending on your actual ID type
    date: string; // Adjust the type if necessary
    title: string;
    short_content: string;
    url: string;
};

class BlogService {
    async getPosts(): Promise<BlogPost[]> {
        const snapshot: DataSnapshot = await get(ref(db, '/blogPosts'));
        const posts: BlogPost[] = [];
        snapshot.forEach((childSnapshot) => {
            const key = childSnapshot.key;
            const value = childSnapshot.val();
            if (key !== null) {
                posts.push({ ...value, id: key });
            }
        });
        return posts;
    }

    async getPost(postId: string): Promise<BlogPost | null> {
        const snapshot: DataSnapshot = await get(ref(db, `/blogPosts/${postId}`));
        const post = snapshot.val();
        return post ? { ...post, id: postId } : null;
    }
}

export default new BlogService();
