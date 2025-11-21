package com.example.ecommerce_platform.Service;

import com.example.ecommerce_platform.entity.*;
import com.example.ecommerce_platform.mapper.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MerchandiseService {
    @Autowired
    private SpuMapper spuMapper;

    @Autowired
    private SpuDetailMapper spuDetailMapper;

    @Autowired
    private SkuMapper skuMapper;

    @Autowired
    private StockMapper stockMapper;

    /**
     * 获取商品详情页数据
     */
    public Map<String, Object> getProductDetail(Long spuId) {
        Map<String, Object> result = new HashMap<>();

        try {
            // 1. 获取SPU基本信息
            Spu spu = spuMapper.findSpuById(spuId);
            if (spu == null || !spu.getValid()) {
                return null; // 商品不存在或已删除
            }
            result.put("spuInfo", spu);

            // 2. 获取SPU详情
            SpuDetail spuDetail = spuDetailMapper.findSpuDetailBySpuId(spuId);
            result.put("spuDetail", spuDetail);

            // 3. 获取所有SKU
            List<Sku> skus = skuMapper.findSkusBySpuId(spuId);
            result.put("skus", skus);

            // 4. 获取所有SKU的库存信息
            if (skus != null && !skus.isEmpty()) {
                List<Long> skuIds = skus.stream()
                        .map(Sku::getId)
                        .collect(java.util.stream.Collectors.toList());
                List<Stock> stocks = stockMapper.findStocksBySkuIds(skuIds);

                // 将库存信息转换为Map便于查找
                Map<Long, Stock> stockMap = new HashMap<>();
                for (Stock stock : stocks) {
                    stockMap.put(stock.getSkuId(), stock);
                }
                result.put("stocks", stockMap);
            }

            return result;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 根据规格参数查找对应的SKU
     */
    public Sku findSkuBySpecs(Long spuId, Map<String, String> selectedSpecs) {
        List<Sku> skus = skuMapper.findSkusBySpuId(spuId);

        for (Sku sku : skus) {
            // 这里需要解析sku.getOwnSpec()并与selectedSpecs比较
            // 简化实现，实际中需要解析JSON格式的规格参数
            if (isSpecMatch(sku.getOwnSpec(), selectedSpecs)) {
                return sku;
            }
        }
        return null;
    }

    /**
     * 检查规格是否匹配（简化实现）
     */
    private boolean isSpecMatch(String ownSpec, Map<String, String> selectedSpecs) {
        // 实际实现需要解析JSON格式的规格参数并进行比较
        // 这里返回true作为示例
        return true;
    }

    /**
     * 获取SKU的库存信息
     */
    public Stock getSkuStock(Long skuId) {
        return stockMapper.findStockBySkuId(skuId);
    }

    /**
     * 减少库存
     */
    public boolean decreaseStock(Long skuId, Integer quantity) {
        try {
            int result = stockMapper.decreaseStock(skuId, quantity);
            return result > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 获取商品列表（分页）
     */
    public List<Spu> getProductList(int page, int size) {
        int start = (page - 1) * size;
        return spuMapper.findSpusByPage(start, size);
    }

    /**
     * 根据分类获取商品
     */
    public List<Spu> getProductsByCategory(Long categoryId) {
        return spuMapper.findSpusByCategoryId(categoryId);
    }

    /**
     * 根据品牌获取商品
     */
    public List<Spu> getProductsByBrand(Long brandId) {
        return spuMapper.findSpusByBrandId(brandId);
    }

    /**
     * 获取上架商品
     */
    public List<Spu> getSaleableProducts() {
        return spuMapper.findSaleableSpus();
    }

    /**
     * 添加新商品
     */
    public boolean addProduct(Spu spu, SpuDetail spuDetail, List<Sku> skus) {
        try {
            // 1. 插入SPU
            int spuResult = spuMapper.insertSpu(spu);
            if (spuResult <= 0) return false;

            // 2. 插入SPU详情
            spuDetail.setSpuId(spu.getId());
            int detailResult = spuDetailMapper.insertSpuDetail(spuDetail);
            if (detailResult <= 0) return false;

            // 3. 插入SKU和库存
            for (Sku sku : skus) {
                sku.setSpuId(spu.getId());
                int skuResult = skuMapper.insertSku(sku);
                if (skuResult <= 0) return false;

                // 创建对应的库存记录
                Stock stock = new Stock();
                stock.setSkuId(sku.getId());
                stock.setStock(0); // 默认库存为0
                stock.setSeckillStock(0);
                stock.setSeckillTotal(0);
                int stockResult = stockMapper.insertStock(stock);
                if (stockResult <= 0) return false;
            }

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 更新商品信息
     */
    public boolean updateProduct(Spu spu, SpuDetail spuDetail) {
        try {
            int spuResult = spuMapper.updateSpu(spu);
            if (spuResult <= 0) return false;

            int detailResult = spuDetailMapper.updateSpuDetail(spuDetail);
            return detailResult > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 上架/下架商品
     */
    public boolean updateProductSaleable(Long spuId, Boolean saleable) {
        try {
            spuMapper.updateSpuSaleable(spuId, saleable);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 删除商品
     */
    public boolean deleteProduct(Long spuId) {
        try {
            // 1. 删除库存（通过SKU）
            List<Sku> skus = skuMapper.findSkusBySpuId(spuId);
            for (Sku sku : skus) {
                stockMapper.deleteStockBySkuId(sku.getId());
            }

            // 2. 删除SKU
            skuMapper.deleteSkusBySpuId(spuId);

            // 3. 删除SPU详情
            spuDetailMapper.deleteSpuDetailBySpuId(spuId);

            // 4. 删除SPU
            spuMapper.deleteSpuById(spuId);

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 获取商品总数
     */
    public int getProductCount() {
        return spuMapper.getSpuCount();
    }

    /**
     * 检查库存是否足够
     */
    public boolean checkStock(Long skuId, Integer quantity) {
        Stock stock = stockMapper.findStockBySkuId(skuId);
        return stock != null && stock.getStock() >= quantity;
    }
}