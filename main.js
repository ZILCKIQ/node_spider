/**
 * https://www.ygdy8.net  最新电影爬虫项目
 */

import request from 'request-promise';
import iconv from 'iconv-lite';
import cheerio from 'cheerio';

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

async function cheerio_load(uri) {
    let options = {
        encoding: null,
        uri,
        transform: function (body) {
            return cheerio.load(iconv.decode(body, 'gb2312').toString());
        }
    };
    return await request(options);
}

async function get_move(url) {
    const $ = await cheerio_load(url);
    const move_info = {
        "name": $('.bd3l > div:nth-child(2) > div:nth-child(1) > h1:nth-child(1) > font').text(),
        "img": $('#Zoom > span > p:nth-child(1) > img:nth-child(1)').attr('src'),
        "download": $('#Zoom > span > p:nth-child(1) > a').attr('href')
    };
    return move_info;
}

(async () => {
    const host = "https://www.ygdy8.net";
    // let url = "/html/gndy/dyzz/list_23_1.html";

    for (let i = 1; i <= 206; i++) {
        let page_list_url = `${host}/html/gndy/dyzz/list_23_${i}.html`;
        const $ = await cheerio_load(page_list_url);
        $('.tbspan tbody tr:nth-child(2) td:nth-child(2) b a').each(async (i, item) => {
            console.log(await get_move(`${host}${$(item).attr('href')}`));
        });
    };
})()
