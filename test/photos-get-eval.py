#!/usr/bin/env python3
import json

def main():
    f = open ("photos-get.dat")
    buf = f.read()
    f.close()

    data = json.loads(buf)
    if len(data['photos']) == 4:
        print ("SUCCESS")
    else:
        print ("FAILURE")

main()

