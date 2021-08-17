<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
  /**
   * The attributes that are mass assignable.
   *
   * @var array
   */
  protected $fillable = [
    'user_id', 'title', 'content'
  ];
  
   /**
   * @return mixed
   */
  public function user() {
    return $this->belongsTo('App\User');
  }

  public function categories() {
    return $this->belongsToMany('App\Category');
  }

  public function comments() {
    return $this->hasMany('App\Comment');
  }
}
