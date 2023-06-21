const scrapers = require("./scrape");
const fs = require("fs");

const scrapeController = async (browserInstance) => {
    const url = "https://phongtro123.com/";
    const indexs = [1, 2, 3, 4];
    try {
        let browser = await browserInstance;
        // gọi hàm cạo ở file scrape ra
        let categories = await scrapers.scrapeCategory(browser, url);
        //!Lọc ra các phần tử có index nằm trong mảng indexs
        const selectCategory = categories.filter((els, index) =>
            // indexs.some((i) => i === index) or
            indexs.includes(index)
        );

        //Cào 1 nav
        const result1 = await scrapers.scrapes(browser, selectCategory[0].link);
        fs.writeFileSync(
            "dataPhongTro.json",
            JSON.stringify(result1),
            (err) => {
                if (err)
                    console.log(
                        ">>>Đã xảy ra lỗi trong quá trình ghi file",
                        err
                    );
                console.log(">>>Đã thêm data vào tệp thành công...");
            }
        );
        const result2 = await scrapers.scrapes(browser, selectCategory[1].link);
        fs.writeFileSync(
            "dataNhaChoThue.json",
            JSON.stringify(result2),
            (err) => {
                if (err)
                    console.log(
                        ">>>Đã xảy ra lỗi trong quá trình ghi file",
                        err
                    );
                console.log(">>>Đã thêm data vào tệp thành công...");
            }
        );
        const result3 = await scrapers.scrapes(browser, selectCategory[2].link);
        fs.writeFileSync("dataCanHo.json", JSON.stringify(result3), (err) => {
            if (err)
                console.log(">>>Đã xảy ra lỗi trong quá trình ghi file", err);
            console.log(">>>Đã thêm data vào tệp thành công...");
        });
        const result4 = await scrapers.scrapes(browser, selectCategory[3].link);
        fs.writeFileSync("dataMatBang.json", JSON.stringify(result4), (err) => {
            if (err)
                console.log(">>>Đã xảy ra lỗi trong quá trình ghi file", err);
            console.log(">>>Đã thêm data vào tệp thành công...");
        });
        browser.close();
        console.log("Đã đóng page");    
    } catch (error) {
        console.log("Lỗi ở scrapeController", error);
    }
};

module.exports = scrapeController;
