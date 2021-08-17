<?php

namespace App\Http\Controllers;
use App\Article;
use App\User;
use App\Comment;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function addArticle(Request $request) {
        $request->validate([
            'title'     => 'required',
            'content'    => 'required'
        ]);
       
        $article = Article::create([
            'user_id' => $request->id,
            'title'   => $request->title,
            'content' => $request->content
        ]);
        
        if ($article->save()) {
            $article->categories()->attach($request->category);
        }

        return response()->json(['message'=>'Article Successfully Posted']);
    }

    public function getArticles() {
        return Article::with(['categories', 'user', 'comments'])->get();
    }

    public function getArticleById(Request $request) {
        return Article::with(['categories', 'user'])->findOrFail($request->id);
    }

    public function getArticleByTitle(Request $request) {
        return Article::with(['categories', 'user', 'comments'])->where('title','like', '%' . $request->title .'%')->get();
    }

    public function deleteArticleById(Request $request) {
        return Article::with(['categories', 'user', 'comments'])->findOrFail($request->id)->delete();
    }

    public function updateArticleById(Request $request) {
        $request->validate([
            'title'     => 'required',
            'content'    => 'required'
        ]);
       
        $article = Article::find($request->id);
      
        $article->title = $request->title;
        $article->content = $request->content;
        if ($article->save()) {
            $article->categories()->detach();
            $article->categories()->attach($request->category);
        }
        return response()->json(['message'=>'Article Successfully Updated']);
    }
}
