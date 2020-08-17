import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  getPosts() {
    this.httpClient
      .get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
          };
        });
      }))
      .subscribe(
        (transformedPosts) => {
          this.posts = transformedPosts;
          this.postsUpdated.next([...this.posts]);
        }
      );
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.httpClient
      .get<{ _id: string, title: string, content: string }>(`http://localhost:3000/api/posts/${id}`);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.httpClient.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData).subscribe(
      (response) => {
        const post: Post = {
          id: response.post.id,
          imagePath: response.post.imagePath,
          title,
          content
        };
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      }
    );
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id, title, content, imagePath: null };
    this.httpClient.put(`http://localhost:3000/api/posts/${id}`, post).subscribe(
      response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      }
    );
  }

  deletePost(postId: string) {
    this.httpClient.delete(`http://localhost:3000/api/posts/${postId}`).subscribe(() => {
      const updatedPosts = this.posts.filter(post => post.id !== postId);
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts]);
    });
  }

}
