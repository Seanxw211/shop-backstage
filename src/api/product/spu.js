// 获取品牌管理数据
import request from '@/utils/request'

// 获取spu列表数据
// GET /admin/product/{page}/{limit}
export const reqSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id } })

// 获取spu信息
// GET /admin/product/getSpuById/{spuId}
export const reqSpu = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' })

// 获取品牌信息
// GET /admin/product/baseTrademark/getTrademarkList
export const reqTrademarkList = () => request({ url: `/admin/product/baseTrademark/getTrademarkList`, method: 'get' })

// 获取spu图片
// GET /admin/product/spuImageList/{spuId}
export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

// 获取销售属性
// GET /admin/product/baseSaleAttrList
export const reqBaseSaleAttrList = () => request({ url: `/admin/product/baseSaleAttrList`, method: 'get' })

// 上传修改或新增的spu
// POST /admin/product/saveSpuInfo
// POST /admin/product/updateSpuInfo
export const reqAddOrUpdateSpu = (spuInfo) => {
    // 如果有id是修改 没有是新增
    if (spuInfo.id) {
        return request({ url: '/admin/product/updateSpuInfo', method: 'post', data: spuInfo })
    } else {
        return request({ url: '/admin/product/saveSpuInfo', method: 'post', data: spuInfo })
    }
}

// 删除spu
// DELETE /admin/product/deleteSpu/{spuId}
export const reqDeleteSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' })

// 添加sku
// POST /admin/product/saveSkuInfo
export const reqAddSku = (skuInfo) => request({ url: `/admin/product/saveSkuInfo`, data: skuInfo, method: 'post' })

// 查看sku列表数据
// GET /admin/product/findBySpuId/{spuId}
export const reqSkuList = (spuId) => request({ url: `/admin/product/findBySpuId/${spuId}`, method: 'get' })
