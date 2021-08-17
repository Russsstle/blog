<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        
        DB::table('categories')->insert([
            [
                'name' => 'Programming',
            ],
            [
                'name' => 'Science',
            ],
            [
                'name' => 'Design',
            ]
            
        ]);

        DB::table('users')->insert([
            [
                'name' => 'Admin Russell',
                'email' => 'admin@gmail.com',
                'user_type' => 'admin',
                'password' => Hash::make('admin12345')
            ],            
        ]);
    }
}
