import Markdown from "react-markdown";
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { storage } from "../../services/FirebaseStorage";
import { ref, getBytes } from "firebase/storage";


function Post() {
  const [markdown, setMarkdown] = useState<string | null>(null);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    console.log(id);
    var file = ref(storage, `posts/${id}.md`)
    getBytes(file).then((content) => {
      // Bytes now contains an ArrayBuffer of the file
      const text = new TextDecoder("utf-8").decode(content);
      setMarkdown(text)
    }).catch((error) => {
      console.error(error);
      setMarkdown("Failed to load post");
    });
  }, []);

  return (
    <div className="mx-10 hyphens-auto break-words markdown-text pb-96 pt-40">
      {markdown ? <Markdown>{markdown}</Markdown> : "Loading..."}
    </div>
  );

}

export default Post;
