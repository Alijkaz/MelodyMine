package ir.taher7.melodymine.core


import ir.taher7.melodymine.storage.Storage
import ir.taher7.melodymine.storage.Talk
import ir.taher7.melodymine.utils.Adventure.hideBossBar
import ir.taher7.melodymine.utils.Adventure.showBossBar
import ir.taher7.melodymine.utils.Adventure.toComponent
import ir.taher7.melodymine.utils.Utils
import me.clip.placeholderapi.PlaceholderAPI
import net.kyori.adventure.bossbar.BossBar
import org.bukkit.entity.Player


class TalkBossBar(val player: Player) {

    lateinit var bossBar: BossBar
    val melodyPlayer = Storage.onlinePlayers[player.uniqueId.toString()]!!

    init {
        initTalkBossBar()
    }

    fun initTalkBossBar() {
        if (!Talk.isEnableBossBar) return
        val serverMute = Talk.bossbarConfigs["server_mute"] ?: return
        var serverMuteText = serverMute.text
        if (Utils.hasPlaceholderAPI()) {
            serverMuteText = PlaceholderAPI.setPlaceholders(player, serverMuteText)
        }
        bossBar = BossBar.bossBar(
            if (melodyPlayer.isMute) serverMuteText.toComponent() else "".toComponent(),
            1f,
            if (melodyPlayer.isMute) BossBar.Color.RED else BossBar.Color.PURPLE,
            BossBar.Overlay.PROGRESS
        )

        if (serverMute.enable && melodyPlayer.isMute && !Talk.isEnableBossBar) {
            showTalkBossBar()
        } else {
            hideTalkBossBar()
        }

    }

    fun showTalkBossBar() {
        if (!Talk.isEnableBossBar) return
        player.showBossBar(bossBar)
    }

    fun hideTalkBossBar() {
        if (!Talk.isEnableBossBar) return
        player.hideBossBar(bossBar)
    }

    fun setBossBarActive() {
        if (!Talk.isEnableBossBar) return
        val active = Talk.bossbarConfigs["active"] ?: return
        val color = BossBar.Color.NAMES.value(active.color.lowercase()) ?: BossBar.Color.WHITE
        if (active.enable) {
            showTalkBossBar()
            var activeText = active.text
            if (Utils.hasPlaceholderAPI()) {
                activeText = PlaceholderAPI.setPlaceholders(player, activeText)
            }
            bossBar.name(activeText.toComponent())
            bossBar.color(color)
        } else {
            hideTalkBossBar()
        }
    }

    fun setBossBarInactive() {
        if (!Talk.isEnableBossBar) return
        val inactive = Talk.bossbarConfigs["inactive"] ?: return
        val color = BossBar.Color.NAMES.value(inactive.color.lowercase()) ?: BossBar.Color.WHITE
        if (inactive.enable) {
            showTalkBossBar()
            var inactiveText = inactive.text
            if (Utils.hasPlaceholderAPI()) {
                inactiveText = PlaceholderAPI.setPlaceholders(player, inactiveText)
            }
            bossBar.name(inactiveText.toComponent())
            bossBar.color(color)
        } else {
            hideTalkBossBar()
        }
    }

    fun setBossBarSelfMute() {
        if (!Talk.isEnableBossBar) return
        val selfMute = Talk.bossbarConfigs["self_mute"] ?: return
        val color = BossBar.Color.NAMES.value(selfMute.color.lowercase()) ?: BossBar.Color.WHITE
        if (selfMute.enable) {
            showTalkBossBar()
            var selfMuteText = selfMute.text
            if (Utils.hasPlaceholderAPI()) {
                selfMuteText = PlaceholderAPI.setPlaceholders(player, selfMuteText)
            }
            bossBar.name(selfMuteText.toComponent())
            bossBar.color(color)
        } else {
            hideTalkBossBar()
        }
    }

    fun setBossBarServerMute() {
        if (!Talk.isEnableBossBar) return
        val serverMute = Talk.bossbarConfigs["server_mute"] ?: return
        val color = BossBar.Color.NAMES.value(serverMute.color.lowercase()) ?: BossBar.Color.WHITE
        if (serverMute.enable) {
            showTalkBossBar()
            var serverMuteText = serverMute.text
            if (Utils.hasPlaceholderAPI()) {
                serverMuteText = PlaceholderAPI.setPlaceholders(player, serverMuteText)
            }
            bossBar.name(serverMuteText.toComponent())
            bossBar.color(color)
        } else {
            hideTalkBossBar()
        }
    }


}