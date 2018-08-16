module.exports = {
  $router: 'course',
  "/details/:id": {
    "course_info": {
      "course_id|+1": 0,
      "course_title": "@cword(3, 10)",
      "course_duration": "@integer(0, 10000)",
      "course_remark": '[{"type":0,"value":"","content":"现在道路车况是越来越不好，车祸也是频繁的发生，为此制度也是一变再，而买车的时候也要注意，有些车是不能随便买的，因为买了也无法上牌过户！现在道路车况是越来越不好，车祸也是频繁的发生，为此制度也是一变再，而买车的时候也要注意，有些车是不能随便买的，因为买了也无法上牌过户！现在道路车况是越来越不好，车祸也是频繁的发生，为此制度也是一变再，而买车的时候也要注意，有些车是不能随便买的，因为买了也无法上牌过户！现在道路车况是越来越不好，车祸也是频繁的发生，为此制度也是一变再，而买车的时候也要注意，有些车是不能随便买的，因为买了也无法上牌过户！现在道路车况是越来越不好，车祸也是频繁的发生，为此制度也是一变再，而买车的时候也要注意，有些车是不能随便买的，因为买了也无法上牌过户！"},{"type":0,"content":"现在道路车况是越来越不好，车祸也是频繁的发生，为此制度也是一变再，而买车的时候也要注意，有些车是不能随便买的，因为买了也无法上牌过户！"},{"type":1,"content":"http://image.qnhdlive.tsingning.com/Fma05FAZJlj0AdJMOvz3XAsrV7XM?w=540&h=320"},{"type":0,"content":"现在道路车况是越来越不好，车祸也是频繁的发生，为此制度也是一变再，而买车的时候也要注意，有些车是不能随便买的，因为买了也无法上牌过户！"},{"type":1,"content":"http://image.qnhdlive.tsingning.com/FoasMpD3X5bApjiPTXgmSBYHZWGz?w=540&h=320"}]',
      "target_user": "@cword(3, 10)",
      "lecturer_name": "@cword(3, 10)",
      "lecturer_title": "@cword(3, 10)",
      "lecturer_id": "@integer(0, 10000)",
      "lecturer_remark": "@cword(3, 10)",
      "lecturer_avatar_address": "@image()",
      "free_file_address": "http://test.qnzhixiang.tsingning.com/o_1bn5044visesklikuf1cth1uc918_cut_100.mp3",
      "free_file_duration": "@integer(0, 100)",
      "course_type|0-1": 0,
      "course_url": "@image('720x300')",
      "sale_total": "@integer(0, 10000)",
      "course_price": "@float(0, 10000, 0, 2)",
      "share_url": "@url()",
      "share_card": "@word(10, 30)",
      "buy_tips": "@cword(20, 80)",
      "status|0-1": 0,
      "is_join_course|0-1": 0,
      "charge_type|0-1": 0,
      "classify_name": "@cword(2, 4)"
    },
    "distributer_income": "@float(0, 10000, 0, 2)",
    "is_bought|0-1": 1,
    "test_course_id|+1": 0
  },
  "/series/details/:id": {
    "course_info": {
      "course_id|+1": 0,
      "course_title": "@cword(3, 10)",
      "course_duration": "@integer(0, 10000)",
      "course_remark": "[{\"type\":0, \"value\": \"sdfsdf\"}, {\"type\":0, \"content\": \"23123123123\"}]",
      "target_user": "@cword(3, 10)",
      "free_file_address": "http://video.qnzhixiang.tsingning.com/lk7SbcLPMuLxdR82773BPmhwLnus",
      "free_file_duration": "@integer(0, 100)",
      "course_type|0-1": 0,
      "course_url": "@image('720x300')",
      "sale_total": "@integer(0, 10000)",
      "course_price": "@float(0, 10000, 0, 2)",
      "share_url": "@url()",
      "share_card": "@word(10, 30)",
      "buy_tips": "@cword(3, 10)",
      "status|0-1": 0,
      "is_join_course|0-1": 0,
      "charge_type|0-1": 0,
      "classify_name": "@cword(2, 4)",
      "count": "@integer(0, 999)",
      "update_status|0-1": 0
    },
    "distributer_income": "@float(0, 10000, 0, 2)",
    "is_bought|0-1": 0,
    "test_course_id|+1": 0,
    "lecturer_info": {
      "avatar_address": "@image()",
      "lecturer_name": "@cword(3, 10)",
      "lecturer_title": "@cword(3, 10)",
      "lecturer_remark": "@cword(3, 99)",
      "lecturer_id": "@integer(0, 10000)",
    },
    "is_join_shop|0-1": 0
  },
  "/series/:id/course_list": {
    "s_course_info_list|0-15": [{
      "s_course_id|+1": 0,
      "course_url": "@image('720x300')",
      "course_title": "@cword(5, 30)",
      "comment_count": "@integer(0, 99999)",
      "create_time": "@dateTime('T')",
      "position|0-6": 0,
      "is_test|0-1": 0,
      "visit_times": "@integer(0, 99999)",
      "course_duration": "@integer(0, 999)",
    }]
  },
  "/vod/:id": {
    "course_id|+1": 0,
    "course_title": "@cword(3, 10)",
    "course_duration": "@integer(0, 10000)",
    "lecturer_name": "@cword(3, 10)",
    "lecturer_title": "@cword(3, 10)",
    "lecturer_id": "@integer(0, 10000)",
    "lecturer_remark": "@cword(3, 10)",
    "lecturer_avatar_address": "@image()",
    "classify_name": "@cword(2, 4)",
    "file_address|1": ["http://video.qnzhixiang.tsingning.com/lk7SbcLPMuLxdR82773BPmhwLnus", "http://test.qnzhixiang.tsingning.com/o_1bn5044visesklikuf1cth1uc918_cut_100.mp3"],
    "course_type|0-1": 0,
    "course_url": "@image('720x300')",
    "distributer_income": "@float(0, 10000, 0, 2)",
    "share_url": "@url()",
    "comment_info_list|10": [{
      "user_info": {
        "user_id|+1": 0,
        "nick_name": "@cword(3, 10)",
        "avatar_address": "@image()"
      },
      "content": "@cword(0, 99)",
      "create_time": "@dateTime('T')",
      "is_lecturer|0-1": 0,
      "position|0-10": 0
    }],
    "share_card": "@word(10, 30)",
    "is_join_course|0-1": 0,
    "status|0-1": 0,
    "is_bought|0-1": 0
  },
  "/series/vod/:id": {
    "s_course_id|+1": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    "course_id|+1": 0,
    "course_title": "@cword(3, 10)",
    "course_duration": "@integer(0, 10000)",
    "lecturer_name": "@cword(3, 10)",
    "lecturer_title": "@cword(3, 10)",
    "lecturer_id": "@integer(0, 10000)",
    "lecturer_remark": "@cword(3, 10)",
    "lecturer_avatar_address": "@image()",
    "classify_name": "@cword(2, 4)",
    "file_path|+1": ["http://image.qnhdlive.tsingning.com/lnpVCb0MgjXmaLWoyavmUM4lIRt9", "http://video.qnzhixiang.tsingning.com/lk7SbcLPMuLxdR82773BPmhwLnus"],
    "course_type|0-1": 0,
    "course_url": "@image('720x300')",
    "distributer_income": "@float(0, 10000, 0, 2)",
    "share_url": "@url()",
    "count": "@integer(0, 999)",
    "course_price": "@float(0, 10000, 0, 2)",
    "comment_info_list|0-10": [{
        "user_info": {
            "user_id|+1": 0,
            "nick_name": "@cword(3, 10)",
            "avatar_address": "@image()"
        },
        "content": "@cword(0, 99)",
        "create_time": "@dateTime('T')",
        "is_lecturer|0-1": 0,
        "position|0-10": 0
    }],
    "share_card": "@word(10, 30)",
    "is_join_course|0-1": 0,
    "status|0-1": 0,
    "is_bought|0-1": 0
  },
  "/series/:id/s_course_id_list": {
    "s_course_ids_list|10": [{
      "s_course_id|+1": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      "is_test|0-1": 0
    }]
  },
  "/comment/:id": {
    "comment_info_list|0-10": [{
      "user_info": {
        "user_id|+1": 0,
        "nick_name": "@cword(3, 10)",
        "avatar_address": "@image()"
      },
      "content": "@cword(0, 99)",
      "create_time": 1507715184370,
      "is_lecturer|0-1": 0,
      "position|0-10": 0
    }]
  },
  "/lecturer/:id/series_list": {
    "course_info_list|0-4": [{
      "course_id|+1": 0,
      "course_title": "@cword(3, 10)",
      "course_type|0-1": 0,
      "course_url": "@image('720x300')",
      "distribute_times|0-1000": 0,
      "course_price": "@float(0, 10000, 0, 2)",
      "distributer_income": "@float(0, 10000, 0, 2)",
      "classify_name": "@cword(2, 4)",
      "charge_type|0-1": 0,
      "is_bought|0-1": 1,
      "is_join_shop|0-1": 0
    }]
  },
  "/lecturer/:id/single_list": {
    "course_info_list|0-20": [{
      "course_id|+1": 0,
      "course_title": "@cword(3, 10)",
      "course_type|0-1": 0,
      "course_url": "@image('720x300')",
      "distribute_times|0-1000": 0,
      "course_price": "@float(0, 10000, 0, 2)",
      "distributer_income": "@float(0, 10000, 0, 2)",
      "classify_name": "@cword(2, 4)",
      "charge_type|0-1": 0,
      "is_bought|0-1": 1,
      "is_join_shop|0-1": 0
    }]
  },
  "/free/join": {}
}
