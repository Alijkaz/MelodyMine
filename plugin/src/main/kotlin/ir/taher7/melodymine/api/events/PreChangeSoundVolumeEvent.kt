package ir.taher7.melodymine.api.events

import ir.taher7.melodymine.models.MelodyPlayer
import org.bukkit.event.Cancellable
import org.bukkit.event.Event
import org.bukkit.event.HandlerList

class PreChangeSoundVolumeEvent (
    val soundName: String,
    val sendToAll: Boolean,
    val socketID: String?,
    val volume: Double?,

) : Event(), Cancellable {
    private var cancelled = false
    override fun isCancelled(): Boolean {
        return cancelled
    }

    override fun setCancelled(cancel: Boolean) {
        cancelled = cancel
    }

    override fun getHandlers(): HandlerList {
        return handlerList
    }

    companion object {
        @JvmStatic
        val handlerList = HandlerList()
    }
}