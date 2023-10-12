package ir.taher7.melodymine.commands.subcommands

import ir.taher7.melodymine.commands.SubCommand
import ir.taher7.melodymine.core.MelodyManager
import ir.taher7.melodymine.storage.Storage
import ir.taher7.melodymine.utils.AdventureUtils.sendMessage
import ir.taher7.melodymine.utils.AdventureUtils.toComponent
import org.bukkit.entity.Player

class Unmute : SubCommand() {
    override var name = "unmute"
    override var description = Storage.unmuteDescription
    override var syntax = "/melodymine unmute <player>"
    override var permission = "melodymine.unmute"
    override fun handler(player: Player, args: Array<out String>) {
        val coolDown = Storage.muteCoolDown
        if (coolDown.containsKey(player.uniqueId) && (System.currentTimeMillis() - coolDown[player.uniqueId]!!) <= 5000) {
            player.sendMessage("<prefix>You can use this command after <#DDB216>${((5000 - (System.currentTimeMillis() - coolDown[player.uniqueId]!!)) / 1000)}</#DDB216> second.".toComponent())
            return
        }

        if (args.size != 2) {
            player.sendMessage("<prefix>use: <i>${syntax}</i>.".toComponent())
            return
        }
        val filter = Storage.onlinePlayers.values.filter { melodyPlayer ->
            melodyPlayer.name.equals(args[1], true)
        }
        if (filter.isEmpty()) {
            player.sendMessage("<prefix>Player does not exist.".toComponent())
            return
        }
        val targetPlayer = filter[0]
        if (!targetPlayer.isMute) {
            player.sendMessage("<prefix>${targetPlayer.name} is not mute.".toComponent())
            return
        }

        MelodyManager.unMute(targetPlayer.uuid)
        targetPlayer.player?.sendMessage("<prefix>You have unmute from voice chat.".toComponent())
        player.sendMessage("<prefix>${targetPlayer.name} has unmute from voice chat.".toComponent())
        coolDown[player.uniqueId] = System.currentTimeMillis()
    }
}