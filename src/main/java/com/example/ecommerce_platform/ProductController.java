package com.example.ecommerce_platform;

import com.example.ecommerce_platform.Service.MerchandiseService;
import com.example.ecommerce_platform.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*") // 允许跨域请求
public class ProductController {

    @Autowired
    private MerchandiseService merchandiseService;

    /**
     * 获取商品详情
     */
    @GetMapping("/{spuId}")
    public Map<String, Object> getProductDetail(@PathVariable Long spuId) {
        Map<String, Object> response = new HashMap<>();

        try {
            Map<String, Object> productDetail = merchandiseService.getProductDetail(spuId);
            if (productDetail == null) {
                response.put("success", false);
                response.put("message", "商品不存在");
                return response;
            }

            response.put("success", true);
            response.put("data", productDetail);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "获取商品详情失败");
        }

        return response;
    }

    /**
     * 获取商品列表（分页）
     */
    @GetMapping("/list")
    public Map<String, Object> getProductList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int size) {
        Map<String, Object> response = new HashMap<>();

        try {
            List<Spu> products = merchandiseService.getProductList(page, size);
            int total = merchandiseService.getProductCount();

            response.put("success", true);
            response.put("data", products);
            response.put("total", total);
            response.put("page", page);
            response.put("size", size);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "获取商品列表失败");
        }

        return response;
    }

    /**
     * 根据分类获取商品
     */
    @GetMapping("/category/{categoryId}")
    public Map<String, Object> getProductsByCategory(@PathVariable Long categoryId) {
        Map<String, Object> response = new HashMap<>();

        try {
            List<Spu> products = merchandiseService.getProductsByCategory(categoryId);
            response.put("success", true);
            response.put("data", products);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "获取分类商品失败");
        }

        return response;
    }

    /**
     * 根据品牌获取商品
     */
    @GetMapping("/brand/{brandId}")
    public Map<String, Object> getProductsByBrand(@PathVariable Long brandId) {
        Map<String, Object> response = new HashMap<>();

        try {
            List<Spu> products = merchandiseService.getProductsByBrand(brandId);
            response.put("success", true);
            response.put("data", products);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "获取品牌商品失败");
        }

        return response;
    }

    /**
     * 获取上架商品
     */
    @GetMapping("/saleable")
    public Map<String, Object> getSaleableProducts() {
        Map<String, Object> response = new HashMap<>();

        try {
            List<Spu> products = merchandiseService.getSaleableProducts();
            response.put("success", true);
            response.put("data", products);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "获取上架商品失败");
        }

        return response;
    }

    /**
     * 根据规格查找SKU
     */
    @PostMapping("/{spuId}/sku")
    public Map<String, Object> findSkuBySpecs(
            @PathVariable Long spuId,
            @RequestBody Map<String, String> selectedSpecs) {
        Map<String, Object> response = new HashMap<>();

        try {
            Sku sku = merchandiseService.findSkuBySpecs(spuId, selectedSpecs);
            if (sku == null) {
                response.put("success", false);
                response.put("message", "未找到匹配规格的商品");
                return response;
            }

            // 获取库存信息
            Stock stock = merchandiseService.getSkuStock(sku.getId());

            Map<String, Object> skuData = new HashMap<>();
            skuData.put("sku", sku);
            skuData.put("stock", stock);

            response.put("success", true);
            response.put("data", skuData);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "查找商品失败");
        }

        return response;
    }

    /**
     * 检查库存
     */
    @GetMapping("/{skuId}/stock")
    public Map<String, Object> checkStock(
            @PathVariable Long skuId,
            @RequestParam Integer quantity) {
        Map<String, Object> response = new HashMap<>();

        try {
            boolean hasStock = merchandiseService.checkStock(skuId, quantity);
            response.put("success", true);
            response.put("data", hasStock);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "检查库存失败");
        }

        return response;
    }

    /**
     * 添加新商品（管理员功能）
     */
    @PostMapping
    public Map<String, Object> addProduct(@RequestBody Map<String, Object> productData) {
        Map<String, Object> response = new HashMap<>();

        try {
            // 解析请求数据
            Spu spu = parseSpuFromRequest(productData);
            SpuDetail spuDetail = parseSpuDetailFromRequest(productData);
            List<Sku> skus = parseSkusFromRequest(productData);

            boolean result = merchandiseService.addProduct(spu, spuDetail, skus);
            if (result) {
                response.put("success", true);
                response.put("message", "添加商品成功");
            } else {
                response.put("success", false);
                response.put("message", "添加商品失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "添加商品失败");
        }

        return response;
    }

    /**
     * 更新商品（管理员功能）
     */
    @PutMapping("/{spuId}")
    public Map<String, Object> updateProduct(
            @PathVariable Long spuId,
            @RequestBody Map<String, Object> productData) {
        Map<String, Object> response = new HashMap<>();

        try {
            Spu spu = parseSpuFromRequest(productData);
            SpuDetail spuDetail = parseSpuDetailFromRequest(productData);

            spu.setId(spuId);
            spuDetail.setSpuId(spuId);

            boolean result = merchandiseService.updateProduct(spu, spuDetail);
            if (result) {
                response.put("success", true);
                response.put("message", "更新商品成功");
            } else {
                response.put("success", false);
                response.put("message", "更新商品失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "更新商品失败");
        }

        return response;
    }

    /**
     * 上架/下架商品（管理员功能）
     */
    @PutMapping("/{spuId}/saleable")
    public Map<String, Object> updateProductSaleable(
            @PathVariable Long spuId,
            @RequestParam Boolean saleable) {
        Map<String, Object> response = new HashMap<>();

        try {
            boolean result = merchandiseService.updateProductSaleable(spuId, saleable);
            if (result) {
                response.put("success", true);
                response.put("message", "操作成功");
            } else {
                response.put("success", false);
                response.put("message", "操作失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "操作失败");
        }

        return response;
    }

    /**
     * 删除商品（管理员功能）
     */
    @DeleteMapping("/{spuId}")
    public Map<String, Object> deleteProduct(@PathVariable Long spuId) {
        Map<String, Object> response = new HashMap<>();

        try {
            boolean result = merchandiseService.deleteProduct(spuId);
            if (result) {
                response.put("success", true);
                response.put("message", "删除商品成功");
            } else {
                response.put("success", false);
                response.put("message", "删除商品失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "删除商品失败");
        }

        return response;
    }

    // 辅助方法：从请求数据中解析Spu对象
    private Spu parseSpuFromRequest(Map<String, Object> productData) {
        Spu spu = new Spu();
        spu.setTitle((String) productData.get("title"));
        spu.setSubTitle((String) productData.get("subTitle"));
        spu.setCid1(Long.valueOf(productData.get("cid1").toString()));
        spu.setCid2(Long.valueOf(productData.get("cid2").toString()));
        spu.setCid3(Long.valueOf(productData.get("cid3").toString()));
        spu.setBrandId(Long.valueOf(productData.get("brandId").toString()));
        spu.setSaleable((Boolean) productData.get("saleable"));
        spu.setValid(true);
        return spu;
    }

    // 辅助方法：从请求数据中解析SpuDetail对象
    private SpuDetail parseSpuDetailFromRequest(Map<String, Object> productData) {
        SpuDetail spuDetail = new SpuDetail();
        spuDetail.setDescription((String) productData.get("description"));
        spuDetail.setGenericSpec((String) productData.get("genericSpec"));
        spuDetail.setSpecialSpec((String) productData.get("specialSpec"));
        spuDetail.setPackingList((String) productData.get("packingList"));
        spuDetail.setAfterService((String) productData.get("afterService"));
        return spuDetail;
    }

    // 辅助方法：从请求数据中解析Sku列表
    private List<Sku> parseSkusFromRequest(Map<String, Object> productData) {
        // 这里简化实现，实际中需要根据前端数据结构进行解析
        // 返回空列表作为示例
        return java.util.Collections.emptyList();
    }
}