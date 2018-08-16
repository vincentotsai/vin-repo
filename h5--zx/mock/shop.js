module.exports = {
    $router: 'shop',
    "/course/list/:id": {
        "course_total": 100,
        "course_info_list|0-20": [{
            "course_id|+1": 0,
            "course_title": "@cword(10, 30)",
            "lecturer_name": "@cword(3, 10)",
            "lecturer_title": "@cword(3, 10)",
            "course_type|0-1": 0,
            "course_url": "@image('720x300')",
            "sale_num": "@integer(0, 1000)",
            "course_price": "@float(0, 10000, 0, 2)",
            "distributer_income": "@float(0, 10000, 0, 2)",
            "share_url": "@url()",
            "lecturer_avatar_address": "@image()",
            "position|0-10": 0,
            "course_duration": "@integer(0, 10000)",
            "is_column|0-1": 0,
            "is_series|0-1": 0,
            "is_bought|0-1": 0,
            "charge_type|0-1": 0
        }],
        "shop_info": {
            "shop_id|+1": 0,
            "shop_name": "@cword(3, 10)",
            "avatar_address": "@image()",
            "share_url": "@url()",
            "share_card": "@word(10, 30)",
            "shop_remark": "@cword(3, 99)",
            "public_rq_code_address": "@word(10, 30)"
        }
    }
}
