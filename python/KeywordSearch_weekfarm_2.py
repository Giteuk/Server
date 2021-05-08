'''동아일보, 한겨레 신문, 경북신문,농업인신문  사사신문을 크롤링'''
import sys
from bs4 import BeautifulSoup
import urllib.request
from urllib.parse import quote
#동아일보 주소들 D로 시작
DTARGET_URL_BEFORE_PAGE_NUM ="http://news.donga.com/search?p="
DTARGET_URL_BEFORE_KEWORD ='&query='
DTARGET_URL_REST = '&check_news=1&more=1&sorting=3&search_date=1&v1=&v2=&range=3'

#한겨레 주소들 H로 시작
HTARGET_URL_BEFORE_KEWORD = 'http://search.hani.co.kr/Search?command=query&' \
                          'keyword='
HTARGET_URL_BEFORE_UNTIL_DATE = '&media=news&submedia=&sort=s&period=all&datefrom=1988.01.01'
HTARGET_URL_REST = '&pageseq='

#경북일보 주소들K로 시작
GTARGET_URL_BEFORE_PAGE_NUM ="https://www.kyongbuk.co.kr/engine_yonhap/search.php?page="
GTARGET_URL_BEFORE_KEWORDE ="&total=3680&picktab=article&searchcont=article&others_cont_type=&div_code="\
"&cust_div_code=&sfield=&article_type=&period=all&from_date=&to_date=&sort=date&searchword="
GTARGET_URL_REST ="&picktab=article&others_cont_type=&sort=weight"

#농업인 신문 주소들 N으로 시작
NTARGET_URL_BEFORE_PAGE_NUM='http://www.nongup.net/news/articleList.html?page='
NTARGET_URL_BEFORE_KEWORD='&total=1239&box_idxno=&sc_area=A&view_type=sm&sc_word='

'''======================================================'''
#동아일보 기사 검색 페이지에서 기사 제목에 링크된 기사 본문 주소 받아오기
def Donga_get_link_from_news_title(page_num, URL, output_file):
    for i in range(page_num):
        current_page_num = 1 + i*15#한 페이지당 15개 있어서
        position = URL.index('=')
        URL_with_page_num = URL[: position+1] + str(current_page_num) \
                            + URL[position+1 :]#링크받아오기인듯
        source_code_from_URL = urllib.request.urlopen(URL_with_page_num)#접속
        soup = BeautifulSoup(source_code_from_URL, 'lxml',
                             from_encoding='utf-8')#뷰티풀수프로 들고오기
        for title in soup.find_all('p', 'tit'):#전체 페이지에서 기사제목 가져온
            title_link = title.select('a')#a태그안에 기사 url이 있음
            article_URL = title_link[0]['href']
            Donga_get_text(article_URL, output_file)
 
# 동아일보기사 본문 내용 긁어오기 (위 함수 내부에서 기사 본문 주소 받아 사용되는 함수)
def Donga_get_text(URL, output_file):
    source_code_from_url = urllib.request.urlopen(URL)
    soup = BeautifulSoup(source_code_from_url, 'lxml', from_encoding='utf-8')
    content_of_article = soup.select('div.article_txt')#div태그안에 article_txt클래스에 기사가 있음
    for item in content_of_article:
        string_item = str(item.find_all(text=True))
        output_file.write(string_item)
'''======================================================'''
        
#한겨레 기사 검색 페이지에서 기사 제목에 링크된 기사 본문 주소 받아오기
def Han_get_link_from_news_title(page_num, URL, output_file):
    for i in range(page_num):
        URL_with_page_num = URL + str(i)
        source_code_from_URL = urllib.request.urlopen(URL_with_page_num)
        soup = BeautifulSoup(source_code_from_URL, 'lxml',
                             from_encoding='utf-8')
        for title in soup.select('dt > a'):
            article_URL = "https:"+title['href']
            Han_get_text(article_URL, output_file)
# 한겨레기사 본문 내용 긁어오기 (위 함수 내부에서 기사 본문 주소 받아 사용되는 함수)
 
def Han_get_text(URL, output_file):
    source_code_from_url = urllib.request.urlopen(URL)
    soup = BeautifulSoup(source_code_from_url, 'lxml', from_encoding='utf-8')
    content_of_article = soup.select('div.text')
    for item in content_of_article:
        string_item = str(item.find_all(text=True))
        output_file.write(string_item)
'''======================================================'''
#경북일보 기사 검색 페이지에서 기사 제목에 링크된 기사 본문 주소 받아오기
def Gyeongbuk_get_link_from_news_title(page_num, URL, output_file):
    for i in range(page_num):
        position = URL.index('=')
        URL_with_page_num = URL[: position+1] + str(i) \
                            + URL[position+1 :]#링크받아오기인듯
        source_code_from_URL = urllib.request.urlopen(URL_with_page_num)#접속
        soup = BeautifulSoup(source_code_from_URL, 'lxml',
                             from_encoding='utf-8')#뷰티풀수프로 들고오기
        for title in soup.find_all('div', 'title'):#전체 페이지에서 기사제목 가져온
            title_link = title.select('a')#a태그안에 기사 url이 있음
            article_URL = title_link[0]['href']
            Gyeongbuk_get_text(article_URL, output_file)
# 경북일보기사 본문 내용 긁어오기 (위 함수 내부에서 기사 본문 주소 받아 사용되는 함수)
def Gyeongbuk_get_text(URL, output_file):
    source_code_from_url = urllib.request.urlopen(URL)
    soup = BeautifulSoup(source_code_from_url, 'lxml', from_encoding='utf-8')
    content_of_article = soup.find_all('div',{"itemprop":"articleBody"})#div태그안에 article_txt클래스에 기사가 있음
    for item in content_of_article:
        string_item = str(item.find_all(text=True))
        output_file.write(string_item)
'''======================================================'''
# 농업인 신문  본문 내용 긁어오기 (위 함수 내부에서 기사 본문 주소 받아 사용되는 함수)
def Nongup_get_link_from_news_title(page_num, URL, output_file):
    for i in range(page_num):
        position = URL.index('=')
        URL_with_page_num = URL[: position+1] + str(i) \
                            + URL[position+1 :]#링크받아오기인듯
        source_code_from_URL = urllib.request.urlopen(URL_with_page_num)#접속
        soup = BeautifulSoup(source_code_from_URL, 'lxml',
                             from_encoding='utf-8')#뷰티풀수프로 들고오기
        for title in soup.find_all('div', 'list-titles'):#전체 페이지에서 기사제목 가져온
            title_link = title.select('a')#a태그안에 기사 url이 있음
            article_URL = 'https://www.nongupin.co.kr/'+title_link[0]['href']
            Nongup_get_text(article_URL, output_file)
           
# 농업인 신문  본문 내용 긁어오기 (위 함수 내부에서 기사 본문 주소 받아 사용되는 함수)
def Nongup_get_text(URL, output_file):
    source_code_from_url = urllib.request.urlopen(URL)
    soup = BeautifulSoup(source_code_from_url, 'lxml', from_encoding='utf-8')
    content_of_article = soup.select('div.article-body')#div태그안에 article_txt클래스에 기사가 있음
    for item in content_of_article:
        string_item = str(item.find_all(text=True))
        output_file.write(string_item)
'''======================================================'''

def main():
    keyword = "재배"
    page_num = int("7")
    output_file_name = "./python/four_article.txt"
    output_file = open(output_file_name, 'a',encoding='UTF-8')
    output_file.write("여기서 부터 재배\n")

    
    #동아일보 크롤링
    Dtarget_URL=DTARGET_URL_BEFORE_PAGE_NUM + DTARGET_URL_BEFORE_KEWORD \
                 + quote(keyword) + DTARGET_URL_REST
    Donga_get_link_from_news_title(page_num, Dtarget_URL, output_file)
    #한겨레 크롤링
    Htarget_URL = HTARGET_URL_BEFORE_KEWORD + quote(keyword) \
                 + HTARGET_URL_BEFORE_UNTIL_DATE +HTARGET_URL_REST
    Han_get_link_from_news_title(page_num, Htarget_URL, output_file)

    #경북일보 크롤링
    Gtarget_URL = GTARGET_URL_BEFORE_PAGE_NUM + GTARGET_URL_BEFORE_KEWORDE \
                 + quote(keyword)+GTARGET_URL_REST
    Gyeongbuk_get_link_from_news_title(page_num, Gtarget_URL, output_file)

    #농업인 크롤링
    Ntarget_URL=NTARGET_URL_BEFORE_PAGE_NUM + NTARGET_URL_BEFORE_KEWORD \
                 + quote(keyword)
    Nongup_get_link_from_news_title(page_num, Ntarget_URL, output_file)

    
    output_file.close()
    print("다함")
    

if __name__ == '__main__':
    main()
