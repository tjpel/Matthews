import asyncio

from argon2 import PasswordHasher

ph = PasswordHasher()


async def hash(password: str) -> str:
    return await asyncio.get_event_loop().run_in_executor(None, ph.hash, password)


async def verify(hash: str, password: str) -> bool:
    return await asyncio.get_event_loop().run_in_executor(
        None, ph.verify, hash, password
    )


def needs_rehash(hash: str) -> bool:
    return ph.check_needs_rehash(hash)
