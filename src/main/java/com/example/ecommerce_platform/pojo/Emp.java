package com.example.ecommerce_platform.pojo;

public class Emp {
    /**
     * 用户名
     */
    private String name;
    /**
     * 密码
     */
    private String password;
    // 必须有无参构造函数
    public Emp() {}

    // Getter 和 Setter 方法
    public String getUsername() {
        return name;
    }

    public void setUsername(String username) {
        this.name = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "Emp{username='" + name + "', password='" + password + "'}";
    }
}