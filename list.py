from mcstatus import MinecraftServer

server = MinecraftServer.lookup("pack.powereclipse.com:25565")
status = server.status()
query = server.query()

print("The server has the following players online: {0}".format(", ".join(query.players.names)))
