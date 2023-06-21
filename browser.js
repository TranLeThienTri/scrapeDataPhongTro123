const puppeteer = require("puppeteer");

//Viết một hàm tạo trình duyệt để cào data
const startBrowser = async () => {
    let browser;
    try {
        //? tạo 1 biến browser để tạo một trình duyệt
        browser = await puppeteer.launch({
            //Có hiện UI chrome khi chạy hay không, false là có
            //khi chạy sẽ mở UI cho chúng ta theo dõi, true sẽ là chạy ngầm
            headless: true,
            //! sử dụng multiple layers của sanbox để tránh những nội dung web không đáng tin cậy,
            //Nếu tin tưởng thì sẽ set như này
            args: ["--disable-setuid-sandbox"],
            //!Bỏ qua tất cả lỗi bảo mật của https
            ignoreHTTPSErrors: true,
        });
    } catch (error) {
        console.log("Không tạo được browser", error);
    }
    return browser;
};

module.exports = startBrowser;
