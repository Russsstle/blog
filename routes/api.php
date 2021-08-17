<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::post('/register', 'AuthController@register');
Route::post('/login', 'AuthController@login');
Route::post('/logout', 'AuthController@logout');
Route::post('/checkUser', 'AuthController@checkUser');
Route::get('/getUsers', 'UserController@getUsers');
Route::post('/getUsersById', 'UserController@getUsersById');
Route::post('/updateUserById', 'UserController@updateUserById');
Route::post('/deleteUserById', 'UserController@deleteUserById');
Route::post('/addArticle', 'ArticleController@addArticle');
Route::post('/getArticleById', 'ArticleController@getArticleById');
Route::post('/updateArticleById', 'ArticleController@updateArticleById');
Route::post('/deleteArticleById', 'ArticleController@deleteArticleById');
Route::get('/getArticles', 'ArticleController@getArticles');
Route::post('/getArticleByTitle', 'ArticleController@getArticleByTitle');
Route::post('/addComment', 'CommentController@addComment');
Route::post('/getComments', 'CommentController@getComments');
Route::post('/deleteCommentById', 'CommentController@deleteCommentById');



