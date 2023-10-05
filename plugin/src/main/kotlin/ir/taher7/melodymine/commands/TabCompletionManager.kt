package ir.taher7.melodymine.commands

import ir.taher7.melodymine.storage.Storage
import org.bukkit.command.Command
import org.bukkit.command.CommandSender
import org.bukkit.command.TabCompleter

class TabCompletionManager : TabCompleter {
    override fun onTabComplete(
        sender: CommandSender,
        command: Command,
        label: String,
        args: Array<out String>
    ): List<String>? {

        when (args.size) {
            1 -> {
                return Storage.subCommands
                    .filter { subCommand -> sender.hasPermission(subCommand.permission) }
                    .map { subCommand -> subCommand.name }
                    .filter { name -> name.contains(args[0], true) }
            }

            else -> {}
        }

        return null
    }

}
