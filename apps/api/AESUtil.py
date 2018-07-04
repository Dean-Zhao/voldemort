# -*- coding:utf-8 -*-
__author__ = 'zhengjiali'
__date__ = '2018/5/31 下午9:26'


from binascii import a2b_hex, b2a_hex
from Crypto.Cipher import AES


# plaintext = '834eadfccac7e1b30664b1aba44815ab'
plaintext = '123456'

key = '00010203050607080a0b0c0d0f10111214151617191a1b1c1e1f202123242526'
encode = '7796597979F4722D89F48D31F8BAD822'

def encrypt(key,plaintext):
	obj = AES.new(a2b_hex(key))
	plaintext = plaintext.encode('utf-8')
	count = 16-len(plaintext)%16
	l = a2b_hex('0'+hex(count)[-1])
	# l[-1] = hex(count)[-1]
	padding = l*count
	text = plaintext+padding
	res = obj.encrypt(text)
	return b2a_hex(res)

def decrypt(key,encode):
	obj = AES.new(a2b_hex(key))
	res = obj.decrypt(a2b_hex(encode))
	return res

# print encrypt(key, plaintext)

# print decrypt(key, encode)
