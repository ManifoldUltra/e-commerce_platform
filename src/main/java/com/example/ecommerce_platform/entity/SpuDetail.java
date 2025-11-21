package com.example.ecommerce_platform.entity;

public class SpuDetail {
    private Long spuId;
    private String description;
    private String genericSpec;
    private String specialSpec;
    private String packingList;
    private String afterService;

    public SpuDetail() {}

    public Long getSpuId() { return spuId; }
    public void setSpuId(Long spuId) { this.spuId = spuId; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getGenericSpec() { return genericSpec; }
    public void setGenericSpec(String genericSpec) { this.genericSpec = genericSpec; }

    public String getSpecialSpec() { return specialSpec; }
    public void setSpecialSpec(String specialSpec) { this.specialSpec = specialSpec; }

    public String getPackingList() { return packingList; }
    public void setPackingList(String packingList) { this.packingList = packingList; }

    public String getAfterService() { return afterService; }
    public void setAfterService(String afterService) { this.afterService = afterService; }

    @Override
    public String toString() {
        return "SpuDetail [spuId=" + spuId + ", description=" + description +
                ", genericSpec=" + genericSpec + ", specialSpec=" + specialSpec +
                ", packingList=" + packingList + ", afterService=" + afterService + "]";
    }
}
