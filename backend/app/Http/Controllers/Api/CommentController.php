<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CommentController extends Controller
{
    public function store(Request $request, string $id): JsonResponse
    {

        $article = Article::find($id);

        if (!$article) {
            return response()->json([
                'success' => false,
                'message' => 'Article not found'
            ], 404);
        }


        $validated = $request->validate([
            'author_name' => 'required|string|max:100',
            'content' => 'required|string|min:3|max:1000',
        ], [
            'author_name.required' => 'Имя автора обязательно для заполнения',
            'author_name.max' => 'Имя автора не должно превышать 100 символов',
            'content.required' => 'Текст комментария обязателен для заполнения',
            'content.min' => 'Комментарий должен быть не менее 3 символов',
            'content.max' => 'Комментарий не должен превышать 1000 символов',
        ]);


        $comment = Comment::create([
            'article_id' => $id,
            'author_name' => $validated['author_name'],
            'content' => $validated['content'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Comment added successfully',
            'data' => $comment
        ], 201);
    }
}
