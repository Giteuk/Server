""" 형태소 분석기
    명사 추출 및 빈도수 체크
    python [모듈 이름] [텍스트 파일명.txt] [결과파일명.txt]
"""
 
import sys
from konlpy.tag import Okt
from collections import Counter
 
 
def get_tags(text, ntags=50):
    spliter = Okt()
    nouns = spliter.nouns(text)
    count = Counter(nouns)
    return_list = []
    for n, c in count.most_common(ntags):
        temp = {'tag': n, 'count': c}
        return_list.append(temp)
    return return_list
 
 
def main():
    
    text_file_name = "four_article.txt"
    noun_count = int("200")
    output_file_name = "four_article_result_word.txt"
    open_text_file = open(text_file_name, 'r',encoding='UTF-8')
    text = open_text_file.read()
    tags = get_tags(text, noun_count)
    open_text_file.close()
    open_output_file = open(output_file_name, 'w',encoding='UTF-8')
    for tag in tags:
        noun = tag['tag']
        count = tag['count']
        open_output_file.write('{} {}\n'.format(noun, count))
    open_output_file.close()
    print('done')
 
 
if __name__ == '__main__':
    main()
