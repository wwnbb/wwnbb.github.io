import { db } from './FirebaseStorage';
import { get, ref } from "firebase/database";

class BlogService {
    async getPosts() {
        const snapshot = await get(ref(db, '/blogPosts'));
        const data = snapshot.val();
        return data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
    }

    async getPost(postId: string) {
        const snapshot = await get(ref(db, `/blogPosts/${postId}`));
        return snapshot.val();
    }
}

export default new BlogService();
