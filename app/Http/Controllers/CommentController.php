<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Comment;

class CommentController extends Controller
{
    public function addComment(Request $request) {
        $request->validate([
            'content'    => 'required'
        ]);
       
        $article = Comment::create([
            'user_id' => $request->userId,
            'article_id'   => $request->articleId,
            'content' => $request->content
        ]);
        
        return response()->json(['message'=>'Success']);
    }

    public function getComments(Request $request) {
        return Comment::with('user')->where('article_id', $request->articleId)->get();
    }

    public function deleteCommentById(Request $request) {
        return Comment::findOrFail($request->id)->delete();
    }
}
