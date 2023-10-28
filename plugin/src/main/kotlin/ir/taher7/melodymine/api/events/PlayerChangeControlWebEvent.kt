package ir.taher7.melodymine.api.events

import ir.taher7.melodymine.models.MelodyControl
import ir.taher7.melodymine.models.MelodyPlayer
import org.bukkit.event.Event
import org.bukkit.event.HandlerList

class PlayerChangeControlWebEvent(
    val melodyPlayer: MelodyPlayer,
    val melodyControl: MelodyControl,
) : Event() {

    override fun getHandlers(): HandlerList {
        return handlerList
    }

    companion object {
        @JvmStatic
        val handlerList = HandlerList()
    }
}