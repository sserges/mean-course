import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';


import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {

  private postsSub: Subscription;
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 10;
  postsPerPage = 1;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  constructor(private postsService: PostsService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
        this.isLoading = false;
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    if (confirm('Sure?')) {
      this.postsService.deletePost(postId);
    }
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

}
