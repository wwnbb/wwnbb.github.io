import { db } from './FirebaseStorage';
import { get, ref } from "firebase/database";

class BlogService {
    async getPosts() {
        const snapshot = await get(ref(db, '/blogPosts'));
        var posts = [];
        for (const [key, value] of Object.entries(snapshot.val())) {
            posts.push({ ...value, id: key });
        }
        return posts;
    }

    async getPost(postId: string) {
        const snapshot = await get(ref(db, `/blogPosts/${postId}`));
        return snapshot.val();
    }
}

export default new BlogService();
