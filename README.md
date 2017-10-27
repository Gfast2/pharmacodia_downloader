# pharmacodia downloader

Download search results webpage page by page, dump them in one file and get them parsed (as xml elements right, WIP: as user friendly csv file).

---

| File   |    Perpose   |
|----------|:-------------:|
| 01_server.js | webpage downloader |
| 02_xmlParser.js |    stage1 parser |
| 03_xmlParser_stage2.js | stage2 parser |

---

## how to build

1. Download repo: `git clone https://github.com/Gfast2/pharmacodia_downloader.git`
2. Install all dependency: `npm install`
3. run software part1 to download data: `node 01_server.js` 
4. run software part2 to do data parsing: `node 02_xmlParser.js`
5. run software part3 to parse result from above: `node 03_xmlParser_stage2.js`

## structure

```
.
├── 01_server.js			// data downloader
├── 02_xmlParser.js			// stage1 parser
├── 03_xmlParser_stage2.js	// stage2 parser
├── Notes.txt				// note about how to deal with this topic
├── output
│   ├── parserResults.txt	// parser result from stage1 parser
│   ├── QueryRawPagesLogfile.txt // 01_server.js running log file
│   ├── rawResultsSum.txt	// concatenate all results from subfolder result_bk
│   └── result_bk			// raw run result from 01_server.js
├── package.json
├── README.md
└── researching
    ├── CompareDifferencesBetweenDifferentCookieInRequestHeader.txt
    ├── CookieExample_1.txt
    ├── CookieExample_2.txt
    ├── CookieExample_3.txt
    ├── OriginalSearchPageSourceCode // search result page with all assets the page needs
    └── queryResponse.html	// one of the search result page
```
