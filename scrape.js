// viết các hàm sử lý ở đây
const scrapeCategory = (browser, url) =>
    new Promise(async (resolve, rejects) => {
        try {
            let page = await browser.newPage();
            console.log(">>> Mở tab trình duyệt mới ...");
            await page.goto(url);
            console.log(">>> Đi tới địa chỉ " + url);
            // đợi cho web load xong mới cào, mỗi trang web sẽ có class hoặc id riêng để chưa các nội dung nên select vào đó là được.
            await page.waitForSelector("#webpage");
            console.log("web đã load xong ....");
            let dataCategory = await page.$$eval(
                "#navbar-menu > ul > li",
                (element) => {
                    let data = element.map((el) => {
                        return {
                            category: el.querySelector("a").innerText,
                            link: el.querySelector("a").href,
                        };
                    });
                    return data;
                }
            );
            await page.close();
            console.log("đã đóng trang ", url);
            resolve(dataCategory);
        } catch (error) {
            console.log("Lỗi ở scrape", error);
            rejects(error);
        }
    });

const scrapes = (browser, url) =>
    new Promise(async (resolve, reject) => {
        try {
            // tạo trang mới
            let newPage = await browser.newPage();
            console.log(">>> Mở tab trình duyệt mới");
            // điều hướng trang đó tới địa chỉ cần thiết
            await newPage.goto(url);
            console.log(">>> Đi tới địa chỉ " + url);
            //đợi load xong trang web
            await newPage.waitForSelector("#main");
            console.log("web đã load xong....");

            const scrapeData = {};
            // Lấy header
            const headerData = await newPage.$eval("header", (el) => {
                return {
                    title: el.querySelector("h1").innerText,
                    description: el.querySelector("p").innerText,
                };
            });

            scrapeData.header = headerData;

            //Lấy link details items
            const linkDetails = await newPage.$$eval(
                "#left-col > section.section-post-listing > ul > li",
                (els) => {
                    linkDetails = els.map((el) => {
                        return el.querySelector(".post-meta > h3 > a").href;
                    });
                    return linkDetails;
                }
            );

            // console.log(linkDetails);

            const scraperDetail = (link) =>
                new Promise(async (resolve, reject) => {
                    try {
                        const pageDetail = await browser.newPage();
                        await pageDetail.goto(link);
                        console.log(">>> Đang đi đến trang ", link);
                        await pageDetail.waitForSelector("#main");

                        const detailData = {};
                        //Bắt đầu cào
                        // cào ảnh
                        const images = await pageDetail.$$eval(
                            "#left-col > article > div.post-images > div > div.swiper-wrapper > div.swiper-slide",
                            (els) => {
                                images = els.map((el) => {
                                    return {
                                        img: el.querySelector("img")?.src,
                                        video: el.querySelector(
                                            "video.video-item > source"
                                        )?.src,
                                    };
                                });
                                return images.filter((i) => !i === false);
                            }
                        );
                        detailData.images = images;

                        // lấy header data

                        const header = await pageDetail.$eval(
                            "#left-col > article >header.page-header",
                            (el) => {
                                return {
                                    title: el.querySelector("h1 > a").innerText,
                                    rate: el.querySelector("h1 > span")
                                        ?.className,
                                    Categories: {
                                        subTitle:
                                            el.querySelector("p").innerText,
                                        content:
                                            el.querySelector("p>a>strong")
                                                .innerText,
                                    },
                                    address:
                                        el.querySelector("address").innerText,
                                    attributes: {
                                        price: el.querySelector(
                                            ".post-attributes > .price > span"
                                        ).innerText,
                                        acreage: el.querySelector(
                                            ".post-attributes > .acreage > span"
                                        ).innerText,
                                        published: el.querySelector(
                                            ".post-attributes > .published > span"
                                        ).innerText,
                                        hashtag: el.querySelector(
                                            ".post-attributes > .hashtag > span"
                                        ).innerText,
                                    },
                                };
                            }
                        );

                        detailData.header = header;

                        // cào thông tin mô tả
                        const mainContentHeader = await pageDetail.$eval(
                            "#left-col > article> section.post-main-content > div.section-header > h2",
                            (el) => el.innerText
                        );

                        const mainContentBody = await pageDetail.$$eval(
                            "#left-col > article> section.post-main-content > .section-content > p",
                            (els) =>
                                (mainContentBody = els.map(
                                    (el) => el.innerText
                                ))
                        );

                        detailData.mainContent = {
                            header: mainContentHeader,
                            body: mainContentBody,
                        };

                        //Thoong tin lien he
                        const postContactHeader = await pageDetail.$eval(
                            "#left-col > article> section.post-contact > .section-header > h3",
                            (el) => el.innerText
                        );

                        const postContactBody = await pageDetail.$$eval(
                            "#left-col > article> section.post-contact > .section-content > table > tbody > tr",
                            (els) =>
                                els.map((el) => ({
                                    title: el.querySelector("td:first-child")
                                        .innerText,
                                    content:
                                        el.querySelector("td:last-child")
                                            .innerText,
                                }))
                        );

                        detailData.contact = {
                            header: postContactHeader,
                            body: postContactBody,
                        };

                        await pageDetail.close();
                        console.log(">>> Đã đóng tab");
                        resolve(detailData);
                    } catch (error) {
                        console.log("Lấy data lỗi", error);
                        reject(error);
                    }
                });

            const details = [];
            for (let link of linkDetails) {
                const detail = await scraperDetail(link);
                details.push(detail);
            }

            scrapeData.body = details;

            
            resolve(scrapeData);
        } catch (error) {
            reject(error);
        }
    });

module.exports = {
    scrapeCategory,
    scrapes,
};
