#!/usr/bin/env python3
from pymemcache.client import base
import time

host = "localhost"
port = 11211

client = base.Client((host, port))

expired_time = 1
client.set("foo", "bar", expired_time)  # in second
print("set foo value to bar with expire 2 second")
print("foo value:", client.get("foo").decode())
time.sleep(expired_time)
print("foo value (expired):", client.get("foo"))
