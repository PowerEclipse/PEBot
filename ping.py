from mcstatus import MinecraftServer

server = MinecraftServer.lookup("pack.powereclipse.com:25565")
status = server.status()
query = server.query()

print ("The server has {0} players and replied in {1} ms".format(status.players.online, status.latency // 2.6))