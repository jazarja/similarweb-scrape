const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

function getData (domain, proxy) {
  return new Promise((resolve, reject) => {
    request({
      url: `https://www.similarweb.com/website/${domain}`,
      'proxy' : proxy ? proxy : undefined,
      headers: {
        Host: 'www.similarweb.com',
        Referer: `https://www.similarweb.com/website/${domain}`,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
        'Upgrade-Insecure-Requests': 1,
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        Pragma: 'no-cache',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.8,es;q=0.6',
  }
    }, (error, response, body) => {
      if (error) {
        return reject(error)
      }

      const data = {
        domain: domain,
        totalVisits: '',
        avgVisitDuration: '',
        pagesPerVisit: '',
        bounceRate: '',
        globalRank: '',
        category: ''
      }

      if (!body) {
        return resolve(data)
      }

      const $ = cheerio.load(body);

      data.globalRank = $('[data-rank-subject="Global"] [data-value]').html();
      data.category = $('[data-rank-subject="Category"] .rankingItem-subTitle').html();
      data.totalVisits = $('[data-type="visits"] .engagementInfo-valueNumber').html();
      data.avgVisitDuration = $('[data-type="time"] .engagementInfo-valueNumber').html();
      data.pagesPerVisit = $('[data-type="ppv"] .engagementInfo-valueNumber').html();
      data.bounceRate = $('[data-type="bounce"] .engagementInfo-valueNumber').html();

      data.similar = [];

      $('li.similarSitesList-item').each(function(i, elem) {
        data.similar.push($(this).attr("data-shorturl"));
      });

      if (data.category) {
        data.category = data.category.replace('&gt;', '>');
      }

      resolve(data)
    })
  })
}

module.exports = {
  getData
}
