package com.example.ecommerce_platform.entity;

public class Customer {
    private int id;
    public String name;
    private String password;

    public Customer(){}
    public Customer(int id, String name, String password) {
        this.id = id;
        this.name = name;
        this.password = password;
    }

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    @Override
    public String toString() {
        return "Customer [id=" + id + ", name=" + name + ", password=" + password + "]";
    }
}
