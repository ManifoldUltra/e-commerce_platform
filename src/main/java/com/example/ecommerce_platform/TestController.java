package com.example.ecommerce_platform;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
public class TestController {


    @RequestMapping("/home")
    public String home(Model model){
        Customer C1 = new Customer();
        C1.setname("用户1");
        model.addAttribute("C1", C1);
        return "home";
    }
    @RequestMapping("/MerchandisePage")
    public String MerchandisePage(Model model){
        Customer C1 = new Customer();
        C1.setname("用户1");
        model.addAttribute("C1", C1);

        Merchandise M1 = new Merchandise();
        M1.setname("商品1");
        model.addAttribute("M1", M1);

        return "MerchandisePage";
    }
}
