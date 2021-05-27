import Mock, {Random} from 'mockjs'

const data = Mock.mock({
  'data|30': [{
    _id: '@id(24)',
    name: '@ctitle',
    'property|1': ['PUBLIC', 'PRIVATE'],
    'alias|0-2': ['@ctitle'],
    'type|1': ['HOSPITAL', 'COMPANY'],
    'classification|1': ['3A', '2A', '1A', '3B', '2B', '1B', '3X', '2X', '1X'],
    'otherClassification|1-3': ['@ctitle'],
    province: '@province',
    city: '@city',
    location: '@city(true)',
    introduction: '@csentence(10, 20)',
    'rank|1-4': [{
      "type": "复旦中国医院排行榜",
      "rankType": "全国综合排行榜",
      "year": 2018,
      "rank": 47
    }],
    phone: '@integer(1, 1000000000)',
    website: '@url',
    route: '@cparagraph(10, 20)',
    avatar: Random.image(),
    updatedAt: '@datetime',
    createdAt: '@datetime',
  }]
})

export default [
  {
    url: '/organization/list/get-list',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: data.data
      }
    }
  },
  {
    url: '/organization/list/get-hospital-list',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: data.data.filter(v => v.type === "HOSPITAL")
      }
    }
  },
  {
    url: '/organization/list/get-non-hospital-list',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        data: data.data.filter(v => v.type !== "HOSPITAL")
      }
    }
  },
]
