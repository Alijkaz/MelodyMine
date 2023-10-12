package ir.taher7.melodymine.commands

import ir.taher7.melodymine.commands.subcommands.*
import ir.taher7.melodymine.storage.Storage
import ir.taher7.melodymine.utils.AdventureUtils.sendMessage
import ir.taher7.melodymine.utils.AdventureUtils.toComponent
import ir.taher7.melodymine.utils.Utils
import org.bukkit.command.Command
import org.bukkit.command.CommandExecutor
import org.bukkit.command.CommandSender
import org.bukkit.entity.Player

class CommandManager : CommandExecutor {

    init {
        Storage.subCommands.add(Reload())
        Storage.subCommands.add(Start())
        Storage.subCommands.add(AdminMode())
        Storage.subCommands.add(Toggle())
        Storage.subCommands.add(Mute())
        Storage.subCommands.add(Unmute())
    }

    override fun onCommand(sender: CommandSender, command: Command, label: String, args: Array<out String>): Boolean {

        if (sender !is Player) {
            sender.sendMessage("<red>Console can not use this command.".toComponent())
            return true
        }

        if (args.isEmpty()) {
            Utils.sendHelpMessage(sender)
            return true
        }

        Storage.subCommands.forEach { subCommand ->
            if (args[0].equals(subCommand.name, true)) {
                if (sender.hasPermission(subCommand.permission)) {
                    subCommand.handler(sender, args)
                } else {
                    sender.sendMessage("<prefix>You dont have permission to use this command.".toComponent())
                }
            }
        }

        return true
    }

}