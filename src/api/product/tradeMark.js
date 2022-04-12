// 获取品牌管理数据
import request from '@/utils/request'

// 获取品牌列表
// url：  /admin/product/baseTrademark/{page}/{limit}  
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })

// 新增品牌
//  url： /admin/product/baseTrademark/save
// 修改品牌
//  url：/admin/product/baseTrademark/update
export const reqAddOrUpdateTrademark = (trademark) => {
    // 如果带有id说明是修改 否则是添新增
    if (trademark.id) {
        return request({ url: `/admin/product/baseTrademark/update`, method: 'put', data: trademark })
    } else {
        return request({ url: `/admin/product/baseTrademark/save`, method: 'post', data: trademark })
    }
}

// 删除品牌
//  url：/admin/product/baseTrademark/remove/{id}
export const reqDeleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' });
