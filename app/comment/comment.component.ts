import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { Validators, FormBuilder, FormGroup} from '@angular/forms';

import { TextField } from 'ui/text-field';
import { Slider } from "ui/slider";

import { Page } from 'ui/page';

import { Comment } from '../shared/comment';

@Component({
  moduleId: module.id,
  templateUrl: './comment.component.html'
})
export class CommentComponent implements OnInit {

  ratingArray = [1, 2, 3, 4, 5];
  author: string;
  comment: string;

  commentForm: FormGroup;


  constructor(
    private params: ModalDialogParams,
    private page: Page,
    private formBuilder: FormBuilder
  ) {

    this.commentForm = this.formBuilder.group({
      author: ['', Validators.required],
      rating: 5,
      comment: ['', Validators.required],
    });
  }

  ngOnInit() {
  }

  onAuthorChange(args) {
    let textField = <TextField>args.object;

    this.commentForm.patchValue({ author: textField.text});
  }

  onRatingChange(args) {
    let slider = <Slider>args.object;

    this.commentForm.patchValue({ rating: slider.value});
  }

  onCommentChange(args) {
    let textField = <TextField>args.object;

    this.commentForm.patchValue({ comment: textField.text});
  }

  public submit() {
    let comment: Comment = this.commentForm.value;
    comment.date = new Date().toISOString();

    //console.log(comment);
    this.params.closeCallback(comment);
  }
}